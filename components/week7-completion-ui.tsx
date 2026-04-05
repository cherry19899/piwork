'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { completeTask, submitRating } from '@/lib/week7-completion';
import { notifyTaskCompletion, notifyRatingReceived } from '@/lib/push-notifications';
import { CheckCircle, Star, Loader2 } from 'lucide-react';

interface CompleteTaskProps {
  taskId: string;
  taskTitle: string;
  taskAmount: number;
  paymentId: string;
  freelancerId: string;
  freelancerName: string;
  onSuccess?: () => void;
}

export function CompleteTaskModal({
  taskId,
  taskTitle,
  taskAmount,
  paymentId,
  freelancerId,
  freelancerName,
  onSuccess
}: CompleteTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeTask(taskId, paymentId, taskTitle, taskAmount);
      await notifyTaskCompletion(freelancerId, taskId, taskTitle);
      onSuccess?.();
      setIsOpen(false);
    } catch (err) {
      setError('Failed to complete task. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Mark Work Complete
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>Confirm that the work is complete and release payment</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="bg-secondary border-border p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Task</p>
                <p className="font-semibold text-foreground">{taskTitle}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <p className="text-sm text-muted-foreground">Payment Amount</p>
                <p className="font-bold text-lg text-accent">{taskAmount} π</p>
              </div>
            </Card>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete & Pay
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  ratedUserId: string;
  ratedUserName: string;
  currentUserId: string;
  onSuccess?: () => void;
}

export function RatingModal({
  isOpen,
  onClose,
  taskId,
  ratedUserId,
  ratedUserName,
  currentUserId,
  onSuccess
}: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState({
    quality: 5,
    communication: 5,
    speed: 5,
    professionalism: 5
  });

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setIsLoading(true);
    try {
      await submitRating(taskId, currentUserId, ratedUserId, rating, comment, categories);
      await notifyRatingReceived(ratedUserId, 'User', rating);
      
      onSuccess?.();
      onClose();
      setRating(5);
      setComment('');
      setCategories({ quality: 5, communication: 5, speed: 5, professionalism: 5 });
    } catch (err) {
      setError('Failed to submit rating. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {ratedUserName}</DialogTitle>
          <DialogDescription>Share your experience working together</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Rating */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-muted-foreground'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-3">
            {Object.entries(categories).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-foreground capitalize mb-1 block">
                  {key}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCategories(prev => ({ ...prev, [key]: star }))}
                      className={`text-lg transition-colors ${
                        star <= value ? 'text-yellow-400' : 'text-muted-foreground'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Comment</label>
            <Textarea
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24 resize-none"
              disabled={isLoading}
            />
          </div>

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
                  <Star className="w-4 h-4 mr-2" />
                  Submit Rating
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
