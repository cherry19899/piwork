import Sentry from '@sentry/nextjs';

export interface ConversationStage {
  stage: 'greeting' | 'problem' | 'solution' | 'proof' | 'cta' | 'closing';
  template: string;
  duration_seconds: number;
  success_metric: string;
}

export interface ObjectionHandler {
  objection: string;
  response: string;
  evidence: string[];
  next_action: string;
}

export class FirstConversationTemplate {
  static readonly FOUNDER_NAME = 'Denis';
  static readonly PLATFORM_NAME = 'PiWork';

  static stages: ConversationStage[] = [
    {
      stage: 'greeting',
      template: `Hi! I'm ${this.FOUNDER_NAME}, building ${this.PLATFORM_NAME} for the Pi community. 
      
I noticed you're interested in design work / freelancing. Have you used Upwork or similar platforms before?`,
      duration_seconds: 30,
      success_metric: 'User confirms using freelance platform',
    },
    {
      stage: 'problem',
      template: `I built this because traditional platforms like Upwork take 20% commission PLUS bank fees.
      
For a $100 job, you're losing $25+. That's crushing for creators in emerging markets where every dollar matters.`,
      duration_seconds: 45,
      success_metric: 'User nods or says "that sucks" / shows frustration',
    },
    {
      stage: 'solution',
      template: `${this.PLATFORM_NAME} is different. You pay designers in Pi Network directly.
      
Just 2% fee. No bank middlemen. Payment locked in escrow until work is approved.
      
Designers get paid instantly. Clients get peace of mind.`,
      duration_seconds: 60,
      success_metric: 'User asks how it works',
    },
    {
      stage: 'proof',
      template: `Let me show you real transaction from yesterday.
      
[SHARE SCREEN: Show actual task completion, escrow release, Pi transfer]
      
Client spent 100 Pi on a logo. Designer got paid in 2 minutes. No bank account needed.`,
      duration_seconds: 120,
      success_metric: 'User says "wow" or "interesting"',
    },
    {
      stage: 'cta',
      template: `Here's what I'm proposing: Create a test task for 50 Pi (about $5).
      
I'll personally find you a designer TODAY. No risk—if work isn't perfect, you get refund instantly.
      
What do you think?`,
      duration_seconds: 60,
      success_metric: 'User agrees to create task',
    },
    {
      stage: 'closing',
      template: `Perfect. What's your Pi username? I'll send you the signup link right now.
      
Once you're in, I'll walk you through posting the task in 2 minutes.`,
      duration_seconds: 30,
      success_metric: 'User provides Pi username and opens link',
    },
  ];

  static getTalkingPoints(): Record<string, string[]> {
    return {
      competition_comparison: [
        'Upwork: 20% commission + payment processor fees',
        'Fiverr: 20% commission + currency conversion losses',
        'PiWork: 2% commission, no middlemen',
      ],
      pi_advantages: [
        'Instant settlement (no waiting for bank transfer)',
        'Works in 150+ countries without bank account',
        'Lower fees = more money for creators',
        'Pi Network has 45M verified users',
      ],
      security_points: [
        'Funds locked in escrow until work approved',
        'KYC verification required (fights fraud)',
        'Dispute resolution by arbitrators',
        'All transactions on blockchain',
      ],
      use_cases: [
        'Logo design: $10-50 Pi',
        'Content writing: $5-20 Pi',
        'Social media graphics: $3-15 Pi',
        'Data entry: $2-10 Pi',
      ],
    };
  }

  static demoFlow(): string {
    return `DEMO FLOW (15 minutes total):

1. INTRO (1 min)
   - Show PiWork homepage
   - Highlight "No bank fees, instant payment"

2. TASK CREATION (3 min)
   - Click "Create Task"
   - Fill in: title, description, budget (50 Pi), deadline (7 days), category
   - Show preview
   - Click "Post" → funds move to escrow

3. FREELANCER RESPONSE (2 min)
   - Show existing task with 3 applications
   - Click on freelancer profile (show rating, portfolio)
   - Click "Select freelancer"
   - Show escrow lock: "50 Pi locked, released on approval"

4. WORK DELIVERY (2 min)
   - Show completed work upload
   - Click "Preview" and "Approve"
   - Show Pi transfer to freelancer: "Sent: 50 Pi"
   - Show transaction on Pi blockchain explorer

5. CLOSING (2 min)
   - "This took 15 minutes. That's your first task."
   - "Questions before we get started?"`;
  }
}

export class ObjectionHandlers implements Record<string, ObjectionHandler> {
  static readonly handlers: Record<string, ObjectionHandler> = {
    no_pi: {
      objection: "I don't have Pi / I don't know how to get Pi",
      response: `No problem, it takes 5 minutes. 
      
1. Download "Pi Network" app from App Store
2. Sign up with phone number
3. Hit mine button daily for 3 days (passive income)
4. Verify identity (KYC)—takes 10 minutes
5. Come back to me

I'll wait. This is the future for 150+ countries without banks.`,
      evidence: [
        'Pi Network app download link',
        'Step-by-step KYC guide (10 min video)',
        'Real mining stats showing 15 Pi/day for casual miners',
      ],
      next_action: 'Schedule callback in 4 days when they complete KYC',
    },

    pi_no_value: {
      objection: "Pi has no value / Pi is a scam / What if Pi crashes?",
      response: `I get it—you want proof. Here's what's real:

1. Pi Lockups: 100M+ Pi locked for 3+ years by serious investors
2. Merchants accepting Pi: Starbucks in some markets, crypto exchanges listing Pi
3. Price history: Started $0.000001, now trading $0.01+ in secondary markets
4. Fundamentals: 45M KYC-verified users, mainnet running since 2021

But honestly? TODAY, Pi value doesn't matter. You're paying $5 in Pi, getting design work.
If Pi goes to $0, you lost $5. If it goes to $1, you're rich. 

But the arbitrage TODAY is real: get work done for less than Fiverr.`,
      evidence: [
        'Pi Lockup statistics',
        'List of merchants accepting Pi',
        'Secondary market price chart',
        'Pi mainnet validator stats',
      ],
      next_action: 'Pivot to arbitrage angle: "Let\'s just try one $5 task"',
    },

    dont_trust_crypto: {
      objection: "I don't trust crypto / Crypto is risky / I want traditional payment",
      response: `I understand. Crypto IS risky when you're sending money to unknown exchanges.

But PiWork is NOT like that:

1. YOUR MONEY IS SAFE: Funds go to escrow, NOT to our wallet
2. KYC VERIFIED: Both freelancer and client verified identity
3. DISPUTE RESOLUTION: If work isn't done, arbitrator refunds you instantly
4. BLOCKCHAIN TRANSPARENT: Every transaction visible on Pi explorer

Plus: Pi Network itself was founded by Stanford PhDs. 45M people using it.

Think of it like eBay escrow, but for freelance work. Does that make sense?`,
      evidence: [
        'Show escrow smart contract code',
        'Pi Network founding team LinkedIn profiles',
        'Dispute resolution process documentation',
        'Real examples of disputes resolved',
      ],
      next_action: 'Suggest micro-test: "$5 task to prove safety"',
    },

    too_complicated: {
      objection: "This is too complicated / I don't want to learn new tech",
      response: `Fair. Crypto UI IS usually complicated. That's why I built PiWork to be simple.

But if it's still overwhelming, here's what I'll do:

I'LL CREATE THE TASK FOR YOU.

Just give me:
- What you need designed (logo, graphic, etc.)
- Budget (I'll suggest 50 Pi)

I'll post it myself. You just click "Approve" when work is done. I'll handle everything else.

How's that?`,
      evidence: [
        'Offer to do setup call together',
        'Show pre-filled task templates',
        'Walkthrough video (2 min)',
      ],
      next_action: 'Schedule 15-min setup call to create first task together',
    },

    requires_kyc: {
      objection: "I don't want to verify my identity / Privacy concerns",
      response: `I get it—privacy matters. Here's why we require it:

1. FRAUD PREVENTION: KYC stops scammers from creating 1000 fake accounts
2. YOUR PROTECTION: Knowing the person you hired is real
3. REGULATORY: Required in most countries we operate in
4. ONE-TIME: You verify once, use forever

All data encrypted, stored by authorized partner. Same as banking.

And honestly? If you're serious about earning money, verification shows YOU'RE legitimate too.
Freelancers want to work with verified clients. You'll get better quality.`,
      evidence: [
        'Privacy policy documentation',
        'KYC partner credentials',
        'Data security certification',
      ],
      next_action: 'Start KYC process immediately',
    },

    will_use_upwork: {
      objection: "I'll just stick with Upwork / Fiverr works fine for me",
      response: `That's valid. They work for some people.

But ask yourself:
- Are you getting 20% of your budget back? You could.
- Do you get instant payment? You don't.
- Can you pay someone in Nigeria / Philippines directly? You can't.

Here's my pitch: Try ONE task on PiWork. 50 Pi test.

Worst case? You'll have saved $1 in fees. 
Best case? You'll realize you've been overpaying Upwork forever.

One task. That's it. What do you say?`,
      evidence: [
        'Fee comparison spreadsheet',
        'Case study of Upwork->PiWork switcher',
      ],
      next_action: 'Get commitment for single test task',
    },

    needs_more_time: {
      objection: "I'm interested but need to think about it / Can I follow up later?",
      response: `Of course. Here's my ask though:

Let me add you to a private group of early users. I'll send you:
- Weekly updates of live tasks
- Real examples of completed work
- Earnings reports from freelancers

No pressure. Just stay in the loop.

Then when you're ready—whether it's tomorrow or next month—you'll remember PiWork and we'll be top of mind.

Sound good? What's your best email?`,
      evidence: [
        'Weekly digest template',
        'Case study email',
      ],
      next_action: 'Add to nurture email sequence, follow-up in 1 week',
    },
  };

  static handleObjection(objection: string): ObjectionHandler | null {
    // Fuzzy match objection to closest handler
    const lowerObjection = objection.toLowerCase();

    for (const [key, handler] of Object.entries(this.handlers)) {
      if (lowerObjection.includes(key.replace(/_/g, ' ').split(' ')[0])) {
        return handler;
      }
    }

    // Log to Sentry if unhandled objection
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage('Unhandled objection', {
        level: 'info',
        contexts: { objection_handling: { original_objection: objection } },
      });
    }

    return null;
  }
}

export class ConversationMetrics {
  static trackConversationStage(stage: ConversationStage, outcome: 'success' | 'failure'): void {
    const metrics = {
      stage: stage.stage,
      outcome,
      timestamp: new Date().toISOString(),
      metric: stage.success_metric,
    };

    // Log to console in dev
    console.log('[v0] Conversation stage outcome:', metrics);

    // Would send to analytics service in production
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversation_stage', metrics);
    }
  }

  static trackObjectionHandled(objection: string, resolved: boolean): void {
    console.log('[v0] Objection handled:', { objection, resolved });
  }
}
