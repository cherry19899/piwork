/**
 * Anti-fraud detection system for Piwork
 * - Device fingerprinting (one account per phone)
 * - Emulator and VPN detection
 * - Duplicate task text detection
 * - Speed anomaly detection
 * - Mass registration detection
 */

export interface DeviceFingerprint {
  deviceId: string;
  phoneNumber: string;
  hardwareId: string;
  timestamp: number;
  location: {
    lat: number;
    lon: number;
  };
}

export interface FraudAlert {
  type: 'EMULATOR' | 'VPN' | 'DUPLICATE_TEXT' | 'FAST_DEAL' | 'MASS_REGISTRATION' | 'SUSPICIOUS_PATTERN';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  details: string;
  timestamp: number;
  action: 'warn' | 'verify' | 'freeze';
}

export interface AnomalyScore {
  userId: string;
  overallRisk: number; // 0-100
  factors: {
    deviceAge: number;
    accountAge: number;
    dealVelocity: number;
    textSimilarity: number;
    networkSuspicion: number;
  };
}

const FRAUD_THRESHOLDS = {
  FAST_DEAL_TIME: 5 * 60 * 1000, // 5 minutes in ms
  MASS_REGISTRATION_WINDOW: 1 * 60 * 60 * 1000, // 1 hour
  MASS_REGISTRATION_COUNT: 10, // 10+ accounts same IP
  DUPLICATE_TEXT_THRESHOLD: 0.85, // 85% similarity
  VELOCITY_THRESHOLD: 5, // 5 deals in 24 hours
};

export class AntiFraudSystem {
  private deviceStore = new Map<string, DeviceFingerprint>();
  private fraudAlerts: FraudAlert[] = [];
  private textCache = new Map<string, Set<string>>();
  private dealTimestamps = new Map<string, number[]>();
  private networkRegistry = new Map<string, string[]>(); // IP -> [userIds]

  /**
   * Register device - one phone = one account
   */
  async registerDevice(
    userId: string,
    fingerprint: DeviceFingerprint
  ): Promise<{ allowed: boolean; alert?: FraudAlert }> {
    // Check if device already has account
    const existingUser = Array.from(this.deviceStore.values()).find(
      fp => fp.deviceId === fingerprint.deviceId && fp.phoneNumber === fingerprint.phoneNumber
    );

    if (existingUser) {
      const alert: FraudAlert = {
        type: 'DUPLICATE_TEXT',
        severity: 'high',
        userId,
        details: `Device already registered to user ${existingUser.deviceId}`,
        timestamp: Date.now(),
        action: 'verify',
      };
      this.fraudAlerts.push(alert);
      return { allowed: false, alert };
    }

    this.deviceStore.set(userId, fingerprint);
    return { allowed: true };
  }

  /**
   * Detect emulator or VPN
   */
  detectEmulatorOrVPN(): boolean {
    // Check for common emulator indicators
    const isEmulator = this.checkEmulatorIndicators();
    const isVPN = this.checkVPNIndicators();
    return isEmulator || isVPN;
  }

  private checkEmulatorIndicators(): boolean {
    if (typeof window === 'undefined') return false;
    
    const checks = [
      navigator.userAgent.includes('Emulator'),
      navigator.userAgent.includes('Simulator'),
      navigator.userAgent.includes('Android Emulator'),
      (navigator as any).hardwareConcurrency <= 2, // Emulators usually have 2 cores
      (navigator as any).deviceMemory <= 2, // Emulators usually have 2GB RAM
    ];
    
    return checks.filter(Boolean).length >= 2;
  }

  private checkVPNIndicators(): boolean {
    if (typeof window === 'undefined') return false;
    
    // VPN detection through various indicators
    const checks = [
      navigator.userAgent.includes('VPN'),
      navigator.userAgent.includes('Proxy'),
      navigator.userAgent.includes('Tor'),
    ];
    
    return checks.some(Boolean);
  }

  /**
   * Detect repeated task text (copy-paste spam)
   */
  async checkTaskTextDuplicate(
    userId: string,
    taskText: string
  ): Promise<{ isDuplicate: boolean; similarity?: number }> {
    const userTexts = this.textCache.get(userId) || new Set();
    
    for (const existingText of userTexts) {
      const similarity = this.calculateTextSimilarity(taskText, existingText);
      if (similarity > FRAUD_THRESHOLDS.DUPLICATE_TEXT_THRESHOLD) {
        return { isDuplicate: true, similarity };
      }
    }
    
    userTexts.add(taskText);
    this.textCache.set(userId, userTexts);
    return { isDuplicate: false };
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Detect suspiciously fast deal completion (<5 min)
   */
  checkFastDealCompletion(dealDurationMs: number): boolean {
    return dealDurationMs < FRAUD_THRESHOLDS.FAST_DEAL_TIME;
  }

  /**
   * Detect mass registrations from same network
   */
  async checkMassRegistration(
    userId: string,
    ipAddress: string
  ): Promise<{ isSuspicious: boolean; count: number }> {
    const userList = this.networkRegistry.get(ipAddress) || [];
    userList.push(userId);
    this.networkRegistry.set(ipAddress, userList);

    // Remove old registrations outside window
    const recentUsers = userList.filter(uid => {
      // This is simplified - in production check actual registration times
      return userList.includes(uid);
    });

    const isSuspicious = recentUsers.length >= FRAUD_THRESHOLDS.MASS_REGISTRATION_COUNT;
    
    if (isSuspicious) {
      const alert: FraudAlert = {
        type: 'MASS_REGISTRATION',
        severity: 'critical',
        userId,
        details: `${recentUsers.length} accounts registered from IP ${ipAddress}`,
        timestamp: Date.now(),
        action: 'freeze',
      };
      this.fraudAlerts.push(alert);
    }

    return { isSuspicious, count: recentUsers.length };
  }

  /**
   * Check deal velocity (too many deals too fast)
   */
  checkDealVelocity(userId: string, maxDealsPerDay: number = 5): boolean {
    const timestamps = this.dealTimestamps.get(userId) || [];
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Remove old timestamps
    const recentDeals = timestamps.filter(t => t > oneDayAgo);
    recentDeals.push(now);
    this.dealTimestamps.set(userId, recentDeals);

    return recentDeals.length > maxDealsPerDay;
  }

  /**
   * Calculate overall anomaly score
   */
  calculateAnomalyScore(
    userId: string,
    accountAgeDays: number,
    dealCount: number,
    reviewCount: number
  ): AnomalyScore {
    const now = Date.now();
    const fingerprint = this.deviceStore.get(userId);

    const factors = {
      deviceAge: fingerprint ? (now - fingerprint.timestamp) / (24 * 60 * 60 * 1000) : 0,
      accountAge: accountAgeDays,
      dealVelocity: this.dealTimestamps.get(userId)?.length || 0,
      textSimilarity: this.textCache.get(userId)?.size || 0,
      networkSuspicion: Array.from(this.networkRegistry.values())
        .filter(users => users.includes(userId))
        .reduce((sum, users) => sum + users.length, 0),
    };

    // Calculate weighted score (0-100)
    let score = 0;
    score += Math.min(20, (factors.deviceAge / 30) * 20); // Device age factor
    score += Math.min(30, (accountAgeDays / 90) * 30); // Account age factor
    score += Math.min(20, (dealCount / 50) * 20); // Deal diversity
    score -= Math.min(20, (reviewCount / 20) * 20); // Positive reviews reduce risk

    return {
      userId,
      overallRisk: Math.max(0, Math.min(100, score)),
      factors,
    };
  }

  /**
   * Get all fraud alerts
   */
  getFraudAlerts(): FraudAlert[] {
    return this.fraudAlerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clear old alerts (older than 30 days)
   */
  clearOldAlerts(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.fraudAlerts = this.fraudAlerts.filter(alert => alert.timestamp > thirtyDaysAgo);
  }
}

export const antiFraudSystem = new AntiFraudSystem();
