/**
 * Notification Service
 * Handles system push notifications for the PiWork app
 */

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  groupId?: string;
  sound?: 'default' | 'silent';
  data?: Record<string, any>;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request permission from user for notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }
    return this.permission;
  }

  /**
   * Send a system push notification
   */
  async sendNotification(options: PushNotificationOptions): Promise<Notification | null> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return null;
    }

    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return null;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/piwork-icon.png',
      badge: options.badge || '/piwork-badge.png',
      tag: options.tag || options.groupId,
      requireInteraction: false,
    });

    // Play notification sound
    if (options.sound === 'default') {
      this.playNotificationSound();
    }

    // Auto-close after 6 seconds
    setTimeout(() => notification.close(), 6000);

    return notification;
  }

  /**
   * Play short notification sound (non-intrusive)
   */
  private playNotificationSound(): void {
    if (typeof window === 'undefined' || !window.AudioContext) {
      return;
    }

    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Create oscillator for a short beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 880; // A5 note
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  /**
   * Group notifications by tag (max 3 per group)
   */
  async sendGroupedNotification(
    options: PushNotificationOptions & { groupId: string }
  ): Promise<Notification | null> {
    const tag = `group-${options.groupId}`;

    return this.sendNotification({
      ...options,
      tag,
    });
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Check current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }
}

export const notificationService = new NotificationService();
