export interface AnomalyAlert {
  id: string;
  type: 'surge' | 'drop' | 'fraud' | 'payment_error';
  metric: string;
  current_value: number;
  baseline_value: number;
  severity: 'info' | 'warning' | 'critical';
  created_at: Date;
  message: string;
}

export class AnomalyDetectionService {
  static detectAnomalies(current: number, baseline: number, threshold: number = 0.3): AnomalyAlert | null {
    const percentChange = Math.abs((current - baseline) / baseline);
    
    if (percentChange > threshold) {
      return {
        id: `anomaly_${Date.now()}`,
        type: current > baseline ? 'surge' : 'drop',
        metric: 'daily_deals',
        current_value: current,
        baseline_value: baseline,
        severity: percentChange > 0.5 ? 'critical' : 'warning',
        created_at: new Date(),
        message: `${current > baseline ? 'Surge' : 'Drop'} detected: ${Math.round(percentChange * 100)}% change`,
      };
    }
    return null;
  }
}
