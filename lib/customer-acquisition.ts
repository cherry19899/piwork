/**
 * Customer Acquisition Scripts for Piwork
 * Target: First 5 paying customers (job creators)
 * Focus: Facebook groups for design, writing, data entry services
 */

export const CUSTOMER_ACQUISITION = {
  // Step 1: Facebook Group Search Criteria
  searchCriteria: {
    keywords: [
      'logo design Philippines group',
      'hire freelancer Philippines',
      'virtual assistant needed Philippines',
      'graphic design services Nigeria',
      'content writers for hire Africa'
    ],
    filters: {
      timeRange: 'past_week',
      postText: ['looking for', 'need help with', 'hiring for', 'seeking'],
      languages: ['English', 'Tagalog', 'Spanish']
    }
  },

  // Step 2: Outreach Message Templates
  messages: {
    customerDM: `Hi {{name}},

I saw you're looking for {{service}}. I built PiWork - a platform where you can hire vetted freelancers and pay them in Pi (cryptocurrency) with ZERO bank fees.

Why it's better:
✓ First task is free commission (you save 2%)
✓ Instant payments in Pi, no delays
✓ Built-in escrow protection
✓ Gig-friendly (no W-2s, no paperwork)

Want a quick demo? Takes 5 minutes.`,

    followUp: `Hi {{name}},

Just following up on PiWork. If you're interested, I can help you create your first task for free and show how it works live.

No pressure - just reach out if you want to try it.`,

    testimonial: `Hi {{name}},

{{previous_customer}} just completed their first design task on PiWork today - they loved it.

Same offer: first task free commission. Let me know if you want to see it in action.`
  },

  // Step 3: Screen Share Demo Flow
  demoFlow: {
    duration: 15,
    steps: [
      '1. Sign up with Pi Network account (30s)',
      '2. Create first task: title, description, budget (2m)',
      '3. Browse freelancer applications (2m)',
      '4. Show escrow protection (2m)',
      '5. Send first 10 Pi to freelancer (2m)',
      '6. Show communication & delivery process (5m)'
    ]
  },

  // Step 4: First Task Success Criteria
  firstTaskTargets: {
    category: ['Logo Design', 'Product Photography', 'Copy Writing', 'Voice Recording'],
    budget: 20-50,  // Pi
    deadline: 7,    // days
    complexity: 'simple',
    goal: 'ship within 48 hours to build trust'
  }
};

export function generateCustomerOutreach(customerProfile: any) {
  return {
    platform: 'facebook_dm',
    template: CUSTOMER_ACQUISITION.messages.customerDM,
    personalization: {
      name: customerProfile.firstName,
      service: customerProfile.serviceNeeded,
      timeZone: customerProfile.timeZone
    },
    followUpSchedule: {
      day1: 'immediate_dm',
      day3: 'follow_up_message',
      day5: 'testimonial_message',
      day7: 'final_offer'
    }
  };
}
