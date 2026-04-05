import { Card } from '@/components/ui/card';

export function EarningsCard() {
  return (
    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-5">
      <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
      <h2 className="text-3xl font-bold text-accent mb-1">245.50 π</h2>
      <p className="text-xs text-muted-foreground">+12.50 π this week</p>
    </Card>
  );
}
