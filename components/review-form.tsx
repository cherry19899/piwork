'use client';

import { useState } from 'react';
import { Star, AlertCircle, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  jobId: string;
  revieweeId: string;
  onSubmit: (rating: number, text: string, category: string) => Promise<void>;
}

export function ReviewForm({ jobId, revieweeId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('quality');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(rating, text, category);
      setSubmitted(true);
      setTimeout(() => {
        setText('');
        setRating(5);
        setCategory('quality');
        setSubmitted(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-secondary border-accent/50 p-4">
        <div className="flex items-center gap-3">
          <Check className="w-6 h-6 text-accent" />
          <div>
            <p className="font-semibold text-foreground">Review submitted successfully</p>
            <p className="text-xs text-muted-foreground">Thank you for your feedback</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Leave a Review</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <Label className="text-xs font-medium text-muted-foreground mb-2 block">Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= rating
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{rating} out of 5 stars</p>
      </div>

      {/* Category */}
      <div className="mb-4">
        <Label className="text-xs font-medium text-muted-foreground mb-2 block">
          Category
        </Label>
        <RadioGroup value={category} onValueChange={setCategory}>
          <div className="space-y-2">
            {[
              { value: 'quality', label: 'Quality of Work' },
              { value: 'communication', label: 'Communication' },
              { value: 'speed', label: 'Speed' },
              { value: 'professionalism', label: 'Professionalism' },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-xs cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <Label htmlFor="review" className="text-xs font-medium text-muted-foreground mb-2 block">
          Your Review
        </Label>
        <Textarea
          id="review"
          placeholder="Share details about your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-sm min-h-20 bg-input border-border text-foreground placeholder:text-muted-foreground"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">{text.length}/500</p>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !text.trim()}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Card>
  );
}

interface ReviewItemProps {
  reviewerName: string;
  reviewerRating: number;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  category: string;
  weight: number;
  timestamp: number;
}

export function ReviewItem({
  reviewerName,
  reviewerRating,
  rating,
  text,
  category,
  weight,
  timestamp,
}: ReviewItemProps) {
  const timeAgo = formatTimeAgo(timestamp);

  return (
    <Card className="bg-secondary border-border p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-sm text-foreground">{reviewerName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2 capitalize">{category}</p>
      <p className="text-xs text-foreground mb-2">{text}</p>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Weight: <span className="font-semibold">{weight.toFixed(1)}x</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Reviewer rating: <span className="font-semibold">{reviewerRating.toFixed(1)}</span>
        </div>
      </div>
    </Card>
  );
}

interface ReviewsListProps {
  reviews: ReviewItemProps[];
  averageRating: number;
  totalReviews: number;
  trustScore: number;
}

export function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  trustScore,
}: ReviewsListProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-card border-border p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-accent">{averageRating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent">{totalReviews}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent">{trustScore}</p>
            <p className="text-xs text-muted-foreground">Trust Score</p>
          </div>
        </div>
      </Card>

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <Card className="bg-secondary border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">No reviews yet</p>
          </Card>
        ) : (
          reviews.map((review, idx) => (
            <ReviewItem key={idx} {...review} />
          ))
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}
