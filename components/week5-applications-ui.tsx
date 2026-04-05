'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { submitApplication } from '@/lib/week5-applications';
import { notifyNewApplication } from '@/lib/push-notifications';
import { Send, Loader2 } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  creatorId: string;
  freelancerId: string;
  freelancerName: string;
  onSuccess?: () => void;
}

export function ApplyModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  creatorId,
  freelancerId,
  freelancerName,
  onSuccess
}: ApplyModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please write a message');
      return;
    }

    setIsLoading(true);
    try {
      await submitApplication(taskId, freelancerId, freelancerName, message);
      await notifyNewApplication(creatorId, taskId, taskTitle, freelancerName);
      
      setMessage('');
      setError('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to submit application. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for "{taskTitle}"</DialogTitle>
          <DialogDescription>Share why you're a great fit for this task</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Tell the client about your experience, relevant skills, and why you should be selected..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 resize-none"
            disabled={isLoading}
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ApplicationsListProps {
  taskId: string;
  creatorId: string;
  onSelectFreelancer: (applicationId: string, freelancerId: string) => void;
  isLoading?: boolean;
}

export function ApplicationsList({
  taskId,
  creatorId,
  onSelectFreelancer,
  isLoading = false
}: ApplicationsListProps) {
  const [applications, setApplications] = useState([]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base">Applications ({applications.length})</h3>
      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet</p>
      ) : (
        applications.map((app: any) => (
          <Card key={app.id} className="bg-card border-border p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">{app.freelancerName}</h4>
                <p className="text-xs text-muted-foreground">Applied 2 hours ago</p>
              </div>
              <Button
                size="sm"
                onClick={() => onSelectFreelancer(app.id, app.freelancerId)}
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Select
              </Button>
            </div>
            <p className="text-sm text-foreground">{app.message}</p>
          </Card>
        ))
      )}
    </div>
  );
}
