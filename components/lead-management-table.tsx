'use client';

import { useEffect, useState } from 'react';
import { AcquisitionLead, AcquisitionMetricsService } from '@/lib/acquisition-metrics';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LeadManagementTable() {
  const [leads, setLeads] = useState<AcquisitionLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<AcquisitionLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, statusFilter]);

  async function loadLeads() {
    try {
      const q = query(collection(db, 'acquisition_leads'));
      const docs = await getDocs(q);
      const loadedLeads = docs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AcquisitionLead[];
      setLeads(loadedLeads);
    } catch (error) {
      console.error('[v0] Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterLeads() {
    if (statusFilter === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(l => l.status === statusFilter));
    }
  }

  async function recordConversion(leadId: string) {
    try {
      await AcquisitionMetricsService.recordDealCompletion(leadId);
      await loadLeads();
    } catch (error) {
      console.error('[v0] Failed to record conversion:', error);
    }
  }

  async function recordRejection(leadId: string, reason: string) {
    try {
      await AcquisitionMetricsService.recordRejection(leadId, reason);
      await loadLeads();
    } catch (error) {
      console.error('[v0] Failed to record rejection:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          All ({leads.length})
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('active')}
        >
          Active ({leads.filter(l => l.status === 'active').length})
        </Button>
        <Button
          variant={statusFilter === 'converted' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('converted')}
        >
          Converted ({leads.filter(l => l.status === 'converted').length})
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected ({leads.filter(l => l.status === 'rejected').length})
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Funnel</th>
              <th className="text-left py-2 px-2">Days Active</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => {
              const daysActive = Math.floor(
                (new Date().getTime() - new Date(lead.first_contact_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              const funnel = [
                lead.responded ? '✓' : '○',
                lead.registered ? '✓' : '○',
                lead.task_created ? '✓' : '○',
                lead.deal_completed ? '✓' : '○',
              ].join('');

              return (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{lead.contact_name}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      lead.contact_type === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {lead.contact_type}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      lead.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                      lead.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono text-xs">{funnel}</td>
                  <td className="py-2 px-2">{daysActive}d</td>
                  <td className="py-2 px-2">
                    {lead.status === 'active' && !lead.deal_completed && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => recordConversion(lead.id!)}
                          className="text-xs"
                        >
                          Convert
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => recordRejection(lead.id!, 'manual_rejection')}
                          className="text-xs"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
