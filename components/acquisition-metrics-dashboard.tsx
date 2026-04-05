'use client';

import { useEffect, useState } from 'react';
import { AcquisitionMetricsService, AcquisitionMetrics } from '@/lib/acquisition-metrics';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AcquisitionMetricsDashboard() {
  const [metrics, setMetrics] = useState<AcquisitionMetrics | null>(null);
  const [customerMetrics, setCustomerMetrics] = useState<AcquisitionMetrics | null>(null);
  const [freelancerMetrics, setFreelancerMetrics] = useState<AcquisitionMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function loadMetrics() {
    try {
      const [all, customers, freelancers] = await Promise.all([
        AcquisitionMetricsService.getAcquisitionMetrics(),
        AcquisitionMetricsService.getAcquisitionMetrics('customer'),
        AcquisitionMetricsService.getAcquisitionMetrics('freelancer'),
      ]);
      setMetrics(all);
      setCustomerMetrics(customers);
      setFreelancerMetrics(freelancers);
    } catch (error) {
      console.error('[v0] Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !metrics) {
    return <div className="text-center py-8">Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Acquisition Metrics</h1>
        <p className="text-gray-600">Overall conversion funnel and performance tracking</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="rejections">Rejections</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              label="Total Contacts"
              value={metrics.total_contacts}
              target={100}
            />
            <MetricCard
              label="Registered Users"
              value={metrics.registrations}
              subtext={`${((metrics.registrations / metrics.total_contacts) * 100).toFixed(1)}% of contacts`}
            />
            <MetricCard
              label="Deals Completed"
              value={metrics.deals_completed}
              target={10}
              highlight={metrics.deals_completed >= 10}
            />
            <MetricCard
              label="Overall Conversion"
              value={`${metrics.overall_contact_to_deal_rate.toFixed(1)}%`}
              target="10%"
            />
            <MetricCard
              label="Avg Time to Deal"
              value={`${metrics.avg_time_to_first_deal_hours.toFixed(1)}h`}
            />
            <MetricCard
              label="Rejection Rate"
              value={`${metrics.rejection_rate.toFixed(1)}%`}
            />
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              <FunnelStage
                stage="Messages Sent"
                count={metrics.messages_sent}
                percentage={100}
              />
              <FunnelStage
                stage="Responses"
                count={metrics.responses}
                percentage={metrics.message_to_response_rate}
                subtext={`${metrics.message_to_response_rate.toFixed(1)}% response rate`}
              />
              <FunnelStage
                stage="Registrations"
                count={metrics.registrations}
                percentage={metrics.response_to_registration_rate}
                subtext={`${metrics.response_to_registration_rate.toFixed(1)}% of responses`}
              />
              <FunnelStage
                stage="Tasks Created"
                count={metrics.tasks_created}
                percentage={metrics.registration_to_task_rate}
                subtext={`${metrics.registration_to_task_rate.toFixed(1)}% of registrations`}
              />
              <FunnelStage
                stage="Deals Completed"
                count={metrics.deals_completed}
                percentage={metrics.task_to_deal_rate}
                subtext={`${metrics.task_to_deal_rate.toFixed(1)}% of tasks`}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Time Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{metrics.avg_response_time_hours.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg to Registration</p>
                <p className="text-2xl font-bold">{metrics.avg_time_to_registration_hours.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg to First Task</p>
                <p className="text-2xl font-bold">{metrics.avg_time_to_first_task_hours.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg to First Deal</p>
                <p className="text-2xl font-bold">{metrics.avg_time_to_first_deal_hours.toFixed(1)}h</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rejections" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Rejection Analysis</h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Total Rejections: <span className="font-semibold">{metrics.rejection_count}</span>
              </p>
              <p className="text-sm text-gray-600">
                Rejection Rate: <span className="font-semibold">{metrics.rejection_rate.toFixed(1)}%</span>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-3">Top Rejection Reasons:</h4>
              {metrics.top_rejection_reasons.length > 0 ? (
                metrics.top_rejection_reasons.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">{item.reason}</span>
                    <span className="font-semibold">{item.count} ({((item.count / metrics.rejection_count) * 100).toFixed(1)}%)</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No rejections yet</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          {customerMetrics && <MetricsTabContent metrics={customerMetrics} type="Customers" />}
        </TabsContent>

        <TabsContent value="freelancers">
          {freelancerMetrics && <MetricsTabContent metrics={freelancerMetrics} type="Freelancers" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  label,
  value,
  target,
  subtext,
  highlight,
}: {
  label: string;
  value: string | number;
  target?: string | number;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-4 ${highlight ? 'bg-green-50 border-green-200' : ''}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {target && <p className="text-xs text-gray-500 mt-1">Target: {target}</p>}
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </Card>
  );
}

function FunnelStage({
  stage,
  count,
  percentage,
  subtext,
}: {
  stage: string;
  count: number;
  percentage: number;
  subtext?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{stage}</span>
        <span className="text-sm font-semibold">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function MetricsTabContent({
  metrics,
  type,
}: {
  metrics: AcquisitionMetrics;
  type: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard label={`${type}: Total`} value={metrics.total_contacts} />
      <MetricCard label={`${type}: Responses`} value={metrics.responses} />
      <MetricCard label={`${type}: Registered`} value={metrics.registrations} />
      <MetricCard
        label={`${type}: Conversion Rate`}
        value={`${metrics.overall_contact_to_deal_rate.toFixed(1)}%`}
      />
      <MetricCard
        label={`${type}: Deals`}
        value={metrics.deals_completed}
      />
      <MetricCard
        label={`${type}: Rejection Rate`}
        value={`${metrics.rejection_rate.toFixed(1)}%`}
      />
    </div>
  );
}
