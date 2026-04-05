import { db } from './firebase';

export interface UserReview {
  id: string;
  reviewerId: string;
  reviewerRating: number;
  revieweeId: string;
  jobId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  category: 'communication' | 'quality' | 'speed' | 'professionalism';
  timestamp: number;
  weight: number; // Calculated based on reviewer's reputation
}

export interface WeightedRatingResult {
  averageRating: number;
  weightedAverageRating: number;
  totalReviews: number;
  breakdown: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  categoryAverages: {
    communication: number;
    quality: number;
    speed: number;
    professionalism: number;
  };
  trustScore: number; // 0-100
}

// Calculate review weight based on reviewer's reputation
export function calculateReviewWeight(reviewerCompletedJobs: number, reviewerCurrentRating: number): number {
  // New user: 1 completed job = weight 0.1
  // Verified user: 100+ completed jobs = weight 2.0
  // Linear scaling between these points
  
  if (reviewerCompletedJobs <= 1) {
    return 0.1;
  }
  
  if (reviewerCompletedJobs >= 100) {
    return 2.0;
  }
  
  // Linear interpolation between 1 job (0.1) and 100 jobs (2.0)
  const weight = 0.1 + ((reviewerCompletedJobs - 1) / 99) * 1.9;
  
  // Apply rating multiplier (4.5+ rating: 1.1x multiplier)
  const ratingMultiplier = reviewerCurrentRating >= 4.5 ? 1.1 : 1.0;
  
  return Math.min(weight * ratingMultiplier, 2.5); // Cap at 2.5
}

// Calculate weighted average rating, removing outliers
export function calculateWeightedRating(reviews: UserReview[]): WeightedRatingResult {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      weightedAverageRating: 0,
      totalReviews: 0,
      breakdown: { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 },
      categoryAverages: { communication: 0, quality: 0, speed: 0, professionalism: 0 },
      trustScore: 0,
    };
  }

  // Calculate simple average
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  // Calculate weighted sum and total weight
  let weightedSum = 0;
  let totalWeight = 0;

  for (const review of reviews) {
    weightedSum += review.rating * review.weight;
    totalWeight += review.weight;
  }

  const weightedAverageRating = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // Breakdown by stars
  const breakdown = {
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
  };

  // Category averages
  const categoryAverages = {
    communication: calculateCategoryAverage(reviews, 'communication'),
    quality: calculateCategoryAverage(reviews, 'quality'),
    speed: calculateCategoryAverage(reviews, 'speed'),
    professionalism: calculateCategoryAverage(reviews, 'professionalism'),
  };

  // Trust score: 0-100
  // Based on weighted rating and review consistency
  const reviewConsistency = 1 - (Math.abs(averageRating - weightedAverageRating) / 5);
  const trustScore = Math.round((weightedAverageRating / 5) * 70 + reviewConsistency * 30);

  return {
    averageRating: Math.round(averageRating * 100) / 100,
    weightedAverageRating: Math.round(weightedAverageRating * 100) / 100,
    totalReviews: reviews.length,
    breakdown,
    categoryAverages,
    trustScore: Math.min(100, Math.max(0, trustScore)),
  };
}

// Calculate average for a specific category
function calculateCategoryAverage(reviews: UserReview[], category: string): number {
  const categoryReviews = reviews.filter(r => r.category === category);
  if (categoryReviews.length === 0) return 0;

  const weightedSum = categoryReviews.reduce((sum, r) => sum + r.rating * r.weight, 0);
  const totalWeight = categoryReviews.reduce((sum, r) => sum + r.weight, 0);

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
}

// Detect and flag suspicious review patterns
export function detectReviewAnomalies(reviews: UserReview[]): {
  suspiciousReviews: UserReview[];
  flags: string[];
} {
  const suspiciousReviews: UserReview[] = [];
  const flags: string[] = [];

  if (reviews.length === 0) {
    return { suspiciousReviews, flags };
  }

  // Check for all 5-star reviews from same reviewer
  const reviewsByReviewer = new Map<string, UserReview[]>();
  for (const review of reviews) {
    if (!reviewsByReviewer.has(review.reviewerId)) {
      reviewsByReviewer.set(review.reviewerId, []);
    }
    reviewsByReviewer.get(review.reviewerId)!.push(review);
  }

  // Flag reviewers with only 5-star reviews
  for (const [reviewerId, userReviews] of reviewsByReviewer) {
    if (userReviews.length >= 3 && userReviews.every(r => r.rating === 5)) {
      flags.push(`Potential vote manipulation from reviewer ${reviewerId}`);
      suspiciousReviews.push(...userReviews);
    }
  }

  // Check for rapid review bombs (multiple reviews in short time)
  const sortedByTime = [...reviews].sort((a, b) => a.timestamp - b.timestamp);
  for (let i = 0; i < sortedByTime.length - 2; i++) {
    const timeDiff = sortedByTime[i + 2].timestamp - sortedByTime[i].timestamp;
    if (timeDiff < 60 * 60 * 1000) { // 1 hour
      flags.push('Potential review bombing detected');
    }
  }

  // Check for identical or near-identical review text
  const reviewTexts = reviews.map(r => r.text.toLowerCase());
  for (let i = 0; i < reviewTexts.length; i++) {
    for (let j = i + 1; j < reviewTexts.length; j++) {
      const similarity = stringSimilarity(reviewTexts[i], reviewTexts[j]);
      if (similarity > 0.9) {
        flags.push('Detected duplicate review content');
        if (!suspiciousReviews.includes(reviews[i])) suspiciousReviews.push(reviews[i]);
        if (!suspiciousReviews.includes(reviews[j])) suspiciousReviews.push(reviews[j]);
      }
    }
  }

  return { suspiciousReviews, flags };
}

// Simple string similarity function (0-1)
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance algorithm
function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Submit a review
export async function submitReview(
  reviewerId: string,
  revieweeId: string,
  jobId: string,
  rating: 1 | 2 | 3 | 4 | 5,
  text: string,
  category: 'communication' | 'quality' | 'speed' | 'professionalism',
  reviewerCompletedJobs: number,
  reviewerCurrentRating: number
): Promise<UserReview> {
  const weight = calculateReviewWeight(reviewerCompletedJobs, reviewerCurrentRating);

  const review: UserReview = {
    id: `${jobId}-${reviewerId}-${Date.now()}`,
    reviewerId,
    reviewerRating: reviewerCurrentRating,
    revieweeId,
    jobId,
    rating,
    text,
    category,
    timestamp: Date.now(),
    weight,
  };

  // TODO: Save to Firebase
  // await db.collection('reviews').add(review);

  return review;
}

// Get all reviews for a user
export async function getUserReviews(userId: string): Promise<UserReview[]> {
  // TODO: Fetch from Firebase
  // const snapshot = await db.collection('reviews').where('revieweeId', '==', userId).get();
  // return snapshot.docs.map(doc => doc.data() as UserReview);
  return [];
}

// Get reviews given by a user
export async function getReviewsGivenByUser(userId: string): Promise<UserReview[]> {
  // TODO: Fetch from Firebase
  // const snapshot = await db.collection('reviews').where('reviewerId', '==', userId).get();
  // return snapshot.docs.map(doc => doc.data() as UserReview);
  return [];
}
