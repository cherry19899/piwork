export interface QueuedMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments: MessageAttachment[];
  timestamp: number;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  retryCount: number;
  serverTimestamp?: number;
}

export interface MessageAttachment {
  id: string;
  type: 'IMAGE' | 'FILE' | 'VOICE';
  data: string; // Base64 encoded
  size: number;
  mimeType: string;
}

export interface ConnectionState {
  isOnline: boolean;
  type: 'OFFLINE' | 'SLOW_MOBILE' | 'MOBILE_3G' | 'MOBILE_4G' | 'WIFI';
  bandwidth: number; // Mbps
  signal: number; // 0-100%
  latency: number; // ms
}

export class OfflineChatSync {
  private queue: Map<string, QueuedMessage> = new Map();
  private db: IDBDatabase | null = null;
  private connectionState: ConnectionState = {
    isOnline: false,
    type: 'OFFLINE',
    bandwidth: 0,
    signal: 0,
    latency: 0
  };

  async initializeDatabase() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('piwork-chat', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('messages')) {
          const store = db.createObjectStore('messages', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('recipientId', 'recipientId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('attachments')) {
          db.createObjectStore('attachments', { keyPath: 'id' });
        }
      };
    });
  }

  async queueMessage(message: QueuedMessage): Promise<void> {
    if (!this.db) await this.initializeDatabase();
    
    const tx = this.db!.transaction(['messages'], 'readwrite');
    const store = tx.objectStore('messages');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(message);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.queue.set(message.id, message);
        resolve();
      };
    });
  }

  async queueAttachment(attachment: MessageAttachment): Promise<void> {
    if (!this.db) await this.initializeDatabase();
    
    const tx = this.db!.transaction(['attachments'], 'readwrite');
    const store = tx.objectStore('attachments');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(attachment);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPendingMessages(): Promise<QueuedMessage[]> {
    if (!this.db) await this.initializeDatabase();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['messages'], 'readonly');
      const store = tx.objectStore('messages');
      const index = store.index('status');
      const request = index.getAll('PENDING');
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async markMessageSent(messageId: string): Promise<void> {
    if (!this.db) await this.initializeDatabase();
    
    const tx = this.db!.transaction(['messages'], 'readwrite');
    const store = tx.objectStore('messages');
    
    await new Promise<void>((resolve, reject) => {
      const getRequest = store.get(messageId);
      
      getRequest.onsuccess = () => {
        const message = getRequest.result;
        if (message) {
          message.status = 'SENT';
          const updateRequest = store.put(message);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  detectConnectionState(): ConnectionState {
    if (!navigator.onLine) {
      return {
        isOnline: false,
        type: 'OFFLINE',
        bandwidth: 0,
        signal: 0,
        latency: 999
      };
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (!connection) {
      return {
        isOnline: true,
        type: 'WIFI',
        bandwidth: 50,
        signal: 100,
        latency: 10
      };
    }

    const effectiveType = connection.effectiveType; // '4g' | '3g' | '2g' | 'slow-2g'
    const downlink = connection.downlink || 5; // Mbps
    
    let type: ConnectionState['type'] = 'MOBILE_4G';
    if (effectiveType === '4g') type = 'MOBILE_4G';
    else if (effectiveType === '3g') type = 'MOBILE_3G';
    else if (effectiveType === '2g') type = 'SLOW_MOBILE';
    else type = 'SLOW_MOBILE';

    return {
      isOnline: true,
      type,
      bandwidth: downlink,
      signal: this.estimateSignalStrength(),
      latency: this.estimateLatency(effectiveType)
    };
  }

  private estimateSignalStrength(): number {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (!connection || !connection.downlink) return 75;
    
    // Map downlink to signal strength (0-100%)
    const mbps = connection.downlink;
    if (mbps >= 50) return 100;
    if (mbps >= 25) return 90;
    if (mbps >= 10) return 75;
    if (mbps >= 5) return 50;
    if (mbps >= 1) return 25;
    return 10;
  }

  private estimateLatency(effectiveType: string): number {
    const latencies = {
      '4g': 20,
      '3g': 80,
      '2g': 300,
      'slow-2g': 2000
    };
    return latencies[effectiveType as keyof typeof latencies] || 100;
  }

  async syncMessages(): Promise<{ synced: number; failed: number }> {
    this.connectionState = this.detectConnectionState();
    
    if (!this.connectionState.isOnline) {
      return { synced: 0, failed: 0 };
    }

    const pendingMessages = await this.getPendingMessages();
    let synced = 0;
    let failed = 0;

    for (const message of pendingMessages) {
      // Respect connection state - don't send large attachments on slow connections
      if (message.attachments.length > 0 && 
          this.connectionState.type === 'SLOW_MOBILE') {
        continue; // Skip for now
      }

      try {
        await this.sendMessageToServer(message);
        await this.markMessageSent(message.id);
        synced++;
      } catch (error) {
        message.retryCount++;
        
        // Exponential backoff: give up after 10 retries
        if (message.retryCount > 10) {
          message.status = 'FAILED';
          await this.updateMessage(message);
        }
        
        failed++;
      }
    }

    return { synced, failed };
  }

  private async sendMessageToServer(message: QueuedMessage): Promise<void> {
    const payload = {
      id: message.id,
      senderId: message.senderId,
      recipientId: message.recipientId,
      content: message.content,
      attachments: message.attachments,
      timestamp: message.timestamp
    };

    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    message.serverTimestamp = result.serverTimestamp;
  }

  private async updateMessage(message: QueuedMessage): Promise<void> {
    if (!this.db) return;
    
    const tx = this.db.transaction(['messages'], 'readwrite');
    const store = tx.objectStore('messages');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(message);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async compressAttachment(file: File): Promise<MessageAttachment> {
    const maxSize = this.getMaxAttachmentSize();
    
    if (file.size > maxSize) {
      throw new Error(`File size ${file.size} exceeds limit ${maxSize}`);
    }

    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result as string;
        const attachment: MessageAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          type: this.getMimeTypeCategory(file.type) as any,
          data: base64,
          size: file.size,
          mimeType: file.type
        };
        resolve(attachment);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private getMaxAttachmentSize(): number {
    // Adjust based on connection type
    const sizes = {
      'OFFLINE': 0,
      'SLOW_MOBILE': 1_000_000, // 1MB
      'MOBILE_3G': 2_000_000, // 2MB
      'MOBILE_4G': 5_000_000, // 5MB
      'WIFI': 10_000_000 // 10MB
    };
    return sizes[this.connectionState.type];
  }

  private getMimeTypeCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('audio/')) return 'VOICE';
    return 'FILE';
  }

  startAutoSync(intervalMs: number = 300000): NodeJS.Timer {
    // Auto-sync every 5 minutes
    return setInterval(() => {
      this.syncMessages().catch(console.error);
    }, intervalMs);
  }

  async clearOldMessages(daysOld: number = 30): Promise<void> {
    if (!this.db) return;
    
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    const tx = this.db.transaction(['messages'], 'readwrite');
    const store = tx.objectStore('messages');
    const index = store.index('timestamp');
    
    const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
    
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  getConnectionStatus(): ConnectionState {
    return this.connectionState;
  }

  getQueueSize(): number {
    return this.queue.size;
  }
}
