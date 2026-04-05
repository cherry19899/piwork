/**
 * Freelancer Acquisition Scripts for Piwork
 * Target: First 10 active freelancers across categories
 * Focus: Facebook groups for work-from-home and online jobs
 */

export const FREELANCER_ACQUISITION = {
  // Target Groups by Region
  targetGroups: {
    philippines: [
      'work from home Philippines',
      'online jobs Philippines',
      'Filipino freelancers',
      'Make money online PH',
      'Side hustles Philippines'
    ],
    nigeria: [
      'Work from home Nigeria',
      'Online jobs Nigeria',
      'Nigerian freelancers',
      'Make money online Africa',
      'Gig work Nigeria'
    ],
    global: [
      'Digital nomad jobs',
      'Freelance community',
      'Work from anywhere',
      'Gig economy workers'
    ]
  },

  // Post Template for Group Comment
  groupPost: `🚀 Earn Pi with your skills - No experience needed!

We're hiring for:
✓ Logo Design & Graphic Design
✓ Copywriting & Content Creation
✓ Photo Enhancement & Data Entry
✓ Voice Acting & Transcription

Why PiWork?
• Payment GUARANTEED in escrow (no scams)
• Keep 98% (only 2% platform fee)
• Instant Pi payout to your wallet
• Build portfolio & reputation

Drop a comment with your skill + Pi username, or DM for a test task (10 Pi paid!)

No experience? We'll guide you through the first task.`,

  // DM Template for Active Commenters
  dmTemplate: `Hi {{name}},

Thanks for commenting! I'm hiring {{skill}} freelancers for PiWork.

Here's what I can offer:
1. Test task: 10 Pi ($0.30) - easy, builds confidence
2. Real projects: 50-200 Pi each after
3. Build portfolio: Your work + reviews visible

First task fully explained and supported. Interested?`,

  // Instructions Post in Comments
  commentInstructions: `Instructions:
1. Download Pi Browser (google "pi browser")
2. Join Pi Network (referral code: piwork)
3. Reply with your Pi username + skill
4. I'll send first test task (10 Pi guaranteed)

Questions? DM me!`,

  // Categories & Pricing
  categories: [
    { name: 'Logo Design', minBudget: 20, maxBudget: 100, difficulty: 'medium' },
    { name: 'Product Photography', minBudget: 15, maxBudget: 50, difficulty: 'easy' },
    { name: 'Copywriting', minBudget: 10, maxBudget: 60, difficulty: 'medium' },
    { name: 'Data Entry', minBudget: 5, maxBudget: 20, difficulty: 'easy' },
    { name: 'Voice Recording', minBudget: 25, maxBudget: 75, difficulty: 'easy' },
    { name: 'Video Editing', minBudget: 50, maxBudget: 150, difficulty: 'hard' }
  ],

  // Test Task Specifications
  testTask: {
    budget: 10,
    duration: 30-60,  // minutes
    description: 'Simple task to verify platform works - full walkthrough provided',
    successCriteria: 'completed_on_time, quality_acceptable',
    nextSteps: 'offer_3x_paid_tasks'
  }
};

export function generateFreelancerOutreach(freelancerProfile: any) {
  const category = FREELANCER_ACQUISITION.categories.find(
    c => c.name === freelancerProfile.skill
  );

  return {
    platform: 'facebook_comment_and_dm',
    groupPost: FREELANCER_ACQUISITION.groupPost,
    personalizedDM: {
      template: FREELANCER_ACQUISITION.dmTemplate,
      personalization: {
        name: freelancerProfile.firstName,
        skill: freelancerProfile.skill
      }
    },
    testTaskOffer: {
      budget: FREELANCER_ACQUISITION.testTask.budget,
      category: category?.name,
      instructions: 'Full walkthrough video provided in task description',
      paymentGuarantee: 'Escrow-protected, paid upon completion'
    },
    followUpSequence: {
      day0: 'send_dm_with_test_task_offer',
      day1: 'check_in_if_no_response',
      day2: 'send_instructions_walkthrough',
      day3: 'offer_paid_task_after_completion'
    }
  };
}
