export interface InfluencerCampaign {
  id: string;
  influencer_id: string;
  campaign_type: 'video_review' | 'telegram_post' | 'community_mention';
  bounty_pi: number;
  status: 'active' | 'completed' | 'expired';
  submission_url?: string;
  views?: number;
  created_at: Date;
  deadline_at: Date;
}

export class InfluencerOutreach {
  static getOutreachTemplates() {
    return {
      video_review: {
        title: 'First Real Deal Video Review',
        description: 'Create a 1-3 minute video showing your first completed transaction',
        reward: 100,
        requirements: ['phone_verified', 'completed_deal'],
      },
      telegram_post: {
        title: 'Telegram Admin Coordination',
        group_size: '10K+ members',
        reward: 500,
        description: 'Pinned post about Piwork for 1 week',
      },
      community_mention: {
        title: 'Community Mention',
        description: 'Organic mention in your regular content',
        reward: 50,
      },
    };
  }
}
