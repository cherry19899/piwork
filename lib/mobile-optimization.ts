// Image compression utility for low bandwidth
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.7
): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob((blob) => {
          resolve(blob || new Blob());
        }, 'image/jpeg', quality);
      };
    };
  });
}

// Get image quality based on connection speed
export function getImageQualityByConnection(connectionType: string): number {
  switch (connectionType) {
    case '4g':
      return 0.8;
    case '3g':
      return 0.6;
    case '2g':
      return 0.4;
    case 'slow-2g':
      return 0.2;
    default:
      return 0.7;
  }
}

// Estimate connection speed
export async function estimateConnectionSpeed(): Promise<string> {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    return conn.effectiveType || '4g';
  }

  // Fallback: test with small file
  const testStart = Date.now();
  try {
    await fetch('/icon-light-32x32.png', { method: 'HEAD' });
    const duration = Date.now() - testStart;

    if (duration < 100) return '4g';
    if (duration < 300) return '3g';
    if (duration < 1000) return '2g';
    return 'slow-2g';
  } catch {
    return '3g'; // Default estimate
  }
}

// Lazy load images
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): Promise<void> {
  return new Promise((resolve) => {
    if (placeholder) {
      img.src = placeholder;
    }

    const imageLoader = new Image();
    imageLoader.src = src;
    imageLoader.onload = () => {
      img.src = src;
      resolve();
    };
    imageLoader.onerror = () => {
      resolve(); // Resolve even on error to not block
    };
  });
}

// Calculate APK size impact
export function estimateComponentSize(component: string): number {
  // Rough estimates in KB
  const sizes: Record<string, number> = {
    'firebase': 450,
    'chart': 200,
    'video': 300,
    'image-processing': 150,
    'animation': 120,
    'maps': 350,
    'icons': 50,
    'ui-components': 100,
  };

  return sizes[component] || 50;
}

// Compression level recommendations
export function getCompressionRecommendations(): {
  maxImageWidth: number;
  maxImageHeight: number;
  jpegQuality: number;
  webpQuality: number;
  lazyLoad: boolean;
  cacheStrategy: 'aggressive' | 'balanced' | 'minimal';
} {
  const connectionType = (navigator as any).connection?.effectiveType || '4g';

  switch (connectionType) {
    case '2g':
    case 'slow-2g':
      return {
        maxImageWidth: 400,
        maxImageHeight: 300,
        jpegQuality: 0.3,
        webpQuality: 0.4,
        lazyLoad: true,
        cacheStrategy: 'aggressive',
      };
    case '3g':
      return {
        maxImageWidth: 600,
        maxImageHeight: 450,
        jpegQuality: 0.5,
        webpQuality: 0.6,
        lazyLoad: true,
        cacheStrategy: 'balanced',
      };
    default: // 4g
      return {
        maxImageWidth: 800,
        maxImageHeight: 600,
        jpegQuality: 0.7,
        webpQuality: 0.8,
        lazyLoad: false,
        cacheStrategy: 'minimal',
      };
  }
}

// Offline storage management
export interface OfflineMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  synced: boolean;
}

export class OfflineStorage {
  private static DB_NAME = 'PiWorkOffline';
  private static DB_VERSION = 1;

  static async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('jobs')) {
          db.createObjectStore('jobs', { keyPath: 'id' });
        }
      };
    });
  }

  static async saveMessage(message: OfflineMessage): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('messages', 'readwrite');
      const store = transaction.objectStore('messages');
      const request = store.add(message);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  static async getUnsyncedMessages(): Promise<OfflineMessage[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('messages', 'readonly');
      const store = transaction.objectStore('messages');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const messages = request.result as OfflineMessage[];
        resolve(messages.filter(m => !m.synced));
      };
    });
  }

  static async markMessageSynced(messageId: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('messages', 'readwrite');
      const store = transaction.objectStore('messages');
      const getRequest = store.get(messageId);

      getRequest.onsuccess = () => {
        const message = getRequest.result as OfflineMessage;
        message.synced = true;
        const updateRequest = store.put(message);
        updateRequest.onerror = () => reject(updateRequest.error);
        updateRequest.onsuccess = () => resolve();
      };
    });
  }

  static async clearMessages(): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('messages', 'readwrite');
      const store = transaction.objectStore('messages');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}
