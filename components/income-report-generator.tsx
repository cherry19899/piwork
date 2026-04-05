'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface IncomeData {
  month: string;
  grossEarnings: number;
  platformFees: number;
  networkFees: number;
  netEarnings: number;
  jobsCompleted: number;
}

export function IncomeReportGenerator() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>(
    'month'
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Sample data - would come from Firebase in production
  const monthlyData: IncomeData[] = [
    {
      month: 'January',
      grossEarnings: 245,
      platformFees: 12.25,
      networkFees: 5.2,
      netEarnings: 227.55,
      jobsCompleted: 9,
    },
    {
      month: 'February',
      grossEarnings: 312,
      platformFees: 15.6,
      networkFees: 6.8,
      netEarnings: 289.6,
      jobsCompleted: 12,
    },
    {
      month: 'March',
      grossEarnings: 428,
      platformFees: 21.4,
      networkFees: 8.9,
      netEarnings: 397.7,
      jobsCompleted: 16,
    },
  ];

  const currentMonthData = monthlyData[selectedMonth] || monthlyData[0];
  const totalEarnings = monthlyData.reduce(
    (sum, m) => sum + m.grossEarnings,
    0
  );
  const totalFees = monthlyData.reduce(
    (sum, m) => sum + m.platformFees + m.networkFees,
    0
  );
  const totalJobs = monthlyData.reduce((sum, m) => sum + m.jobsCompleted, 0);

  const handleGenerateReport = () => {
    const csvContent = [
      'Piwork Income Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      `Period: ${selectedMonth + 1}/${selectedYear}`,
      '',
      'Monthly Breakdown',
      'Month,Gross Earnings (π),Platform Fees,Network Fees,Net Earnings (π),Jobs',
      ...monthlyData.map(
        m =>
          `${m.month},${m.grossEarnings},${m.platformFees},${m.networkFees},${m.netEarnings},${m.jobsCompleted}`
      ),
      '',
      'Totals',
      `Total Gross,${totalEarnings}`,
      `Total Fees,${totalFees}`,
      `Total Net,${totalEarnings - totalFees}`,
      `Total Jobs,${totalJobs}`,
      '',
      'Disclaimer',
      'This report is for informational purposes only. You are responsible for all tax obligations in your jurisdiction.',
      'Piwork is not a tax advisor. Consult with local tax authorities.',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piwork-income-report-${selectedYear}-${String(
      selectedMonth + 1
    ).padStart(2, '0')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-5 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-foreground">Income Report</h1>
        <p className="text-xs text-muted-foreground">
          Tax documentation and earnings summary
        </p>
      </div>

      {/* Period Selector */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {(['month', 'quarter', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedPeriod === period
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground border border-border'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Date Selector */}
      <div className="px-4 pt-3 flex gap-2">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
          className="flex-1 px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground"
        >
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground"
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="px-4 pt-4">
        <div className="space-y-2.5">
          <Card className="bg-card border-border p-3.5">
            <p className="text-xs text-muted-foreground mb-1">Gross Earnings</p>
            <p className="text-2xl font-bold text-accent">
              {currentMonthData.grossEarnings} π
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthData.jobsCompleted} jobs completed
            </p>
          </Card>

          <Card className="bg-card border-border p-3.5">
            <p className="text-xs text-muted-foreground mb-1">Fees</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-destructive">
                  -{(currentMonthData.platformFees + currentMonthData.networkFees).toFixed(2)} π
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Platform {currentMonthData.platformFees.toFixed(2)} π + Network{' '}
                  {currentMonthData.networkFees.toFixed(2)} π
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-3.5">
            <p className="text-xs text-muted-foreground mb-1">Net Earnings</p>
            <p className="text-2xl font-bold text-accent">
              {currentMonthData.netEarnings} π
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              After all deductions
            </p>
          </Card>
        </div>
      </div>

      {/* Breakdown Table */}
      <section className="px-4 pt-6">
        <h2 className="text-sm font-bold text-foreground mb-3">
          Monthly History
        </h2>
        <div className="space-y-2">
          {monthlyData.map((month, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {month.month}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {month.jobsCompleted} jobs
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-accent">
                  {month.netEarnings} π
                </p>
                <p className="text-xs text-muted-foreground">
                  net
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Total Summary */}
      <section className="px-4 pt-6">
        <Card className="bg-secondary border-border p-3.5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">
                Total Gross Earnings
              </span>
              <span className="text-sm font-semibold text-foreground">
                {totalEarnings} π
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Total Fees</span>
              <span className="text-sm font-semibold text-destructive">
                -{totalFees.toFixed(2)} π
              </span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex justify-between">
              <span className="text-xs font-semibold text-foreground">
                Total Net Earnings
              </span>
              <span className="text-base font-bold text-accent">
                {(totalEarnings - totalFees).toFixed(2)} π
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">
                Total Jobs Completed
              </span>
              <span className="text-sm font-semibold text-foreground">
                {totalJobs}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Compliance Notices */}
      <section className="px-4 pt-6">
        <h2 className="text-sm font-bold text-foreground mb-3">
          Tax & Compliance
        </h2>
        <div className="space-y-2.5">
          <Card className="bg-secondary border-border p-3.5">
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Self-Employed Status
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You are an independent contractor. Report all income to tax
                  authorities.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-border p-3.5">
            <div className="flex gap-3">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  No Tax Calculation
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This report shows earnings only. Consult with tax professionals for deductions
                  and obligations.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-border p-3.5">
            <div className="flex gap-3">
              <FileText className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  For Your Records
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download and keep reports for your personal records and tax filing.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Export Buttons */}
      <div className="px-4 pt-6 pb-4 space-y-2">
        <Button
          onClick={handleGenerateReport}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as CSV
        </Button>
        <Button
          variant="outline"
          className="w-full border-border hover:bg-secondary text-foreground font-semibold"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Full Details
        </Button>
      </div>
    </div>
  );
}
