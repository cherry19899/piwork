export interface AnalyticsMetrics {
  dau: number; // Daily Active Users
  retention_day1: number;
  retention_day7: number;
  retention_day30: number;
  avg_session_time: number; // minutes
  total_users: number;
  total_tasks: number;
  total_completed_tasks: number;
  total_revenue_pi: number;
}

export interface ConversionFunnel {
  registrations: number;
  kyc_verified: number;
  first_task_posted: number;
  first_application: number;
  first_completed: number;
}

export class FirebaseAnalyticsService {
  static trackEvent(eventName: string, params: Record<string, any>) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventName, params);
    }
  }

  static trackConversion(userId: string, conversionType: string, value?: number) {
    this.trackEvent('conversion', {
      user_id: userId,
      conversion_type: conversionType,
      value: value,
      timestamp: new Date().toISOString(),
    });
  }

  static trackUserSignup(userId: string, source: string) {
    this.trackEvent('sign_up', {
      user_id: userId,
      signup_source: source,
      timestamp: new Date().toISOString(),
    });
  }
}
