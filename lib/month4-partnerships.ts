export interface PioneerInfluencer {
  id: string;
  username: string;
  audience_size: number;
  telegram_handle?: string;
  twitter_handle?: string;
  youtube_channel?: string;
  email: string;
  engagement_rate: number;
  previous_reviews?: number;
  review_bounty_pi: number;
  status: 'pending' | 'contacted' | 'accepted' | 'completed' | 'declined';
}

export interface AmbassadorProfile {
  user_id: string;
  commission_rate: number;
  total_referrals: number;
  active_referrals: number;
  total_earnings_pi: number;
  joined_date: Date;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  next_tier_referrals: number;
}
