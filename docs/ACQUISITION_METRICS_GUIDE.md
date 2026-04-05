# Acquisition Metrics Tracking Guide

## Overview
This guide covers how to track and analyze customer and freelancer acquisition metrics for Piwork. The system measures conversion at each stage of the funnel and identifies rejection reasons for optimization.

## Funnel Stages

### 1. Message Sent
- **Definition**: Initial outreach via Facebook DM, email, or comment
- **Tracking**: Automatically recorded when creating a lead
- **Target**: 100 messages across customers and freelancers combined

### 2. Response (25-30% conversion target)
- **Definition**: Lead replies to initial message
- **Tracking**: Call `AcquisitionMetricsService.recordResponse(leadId)`
- **Time metric**: Record how long until response (target: <24 hours)

### 3. Registration (60-70% of responses)
- **Definition**: User creates Pi Network account and completes KYC
- **Tracking**: Call `AcquisitionMetricsService.recordRegistration(leadId, piUsername)`
- **Time metric**: Hours from response to registration

### 4. Task Created (70-80% of registrations for customers)
- **Definition**: Customer posts first task on platform
- **Tracking**: Call `AcquisitionMetricsService.recordTaskCreation(leadId)`
- **Freelancers**: Skip this stage, move directly to deal

### 5. Deal Completed (80-90% of tasks)
- **Definition**: Task completed, payment processed, deal closed
- **Tracking**: Call `AcquisitionMetricsService.recordDealCompletion(leadId)`
- **Overall target**: 10 deals from 100 contacts = 10% conversion

## Key Metrics

### Conversion Rates
- **Message → Response**: Target 25-30% (25-30 responses from 100 messages)
- **Response → Registration**: Target 60-70% (15-20 registrations from 25-30 responses)
- **Registration → Task**: Target 70-80% (10-15 tasks from 15-20 registrations) [Customers only]
- **Task → Deal**: Target 80-90% (8-13 deals from 10-15 tasks)
- **Overall Contact → Deal**: Target 10% (10 deals from 100 contacts)

### Time Metrics
- **Response Time**: Average hours until reply (target: <24h)
- **Registration Time**: Average hours to sign up after response (target: <2 hours)
- **Task Creation Time**: Average hours to post task after registration (target: <12 hours)
- **Deal Completion Time**: Average hours from first contact to completed deal (target: 5-7 days)

## Rejection Tracking

### Recording Rejections
Call `AcquisitionMetricsService.recordRejection(leadId, reason, notes)` with one of these standardized reasons:

**Customer Rejections:**
- `no_pi_currency` - "I don't have Pi"
- `no_value_concern` - "Pi has no value"
- `crypto_distrust` - "I don't trust crypto"
- `complexity_concern` - "Too complicated"
- `competitor_using` - "I'll stick with Upwork"
- `no_need` - "Don't need freelancers"
- `no_followup` - "Stopped responding"

**Freelancer Rejections:**
- `already_working` - "Already on other platforms"
- `skill_not_match` - "My skills not listed"
- `payment_concern` - "Worried about not getting paid"
- `no_upfront` - "Want upfront payment, not escrow"
- `no_followup` - "Stopped responding"
- `joined_competitor` - "Joined similar platform"

### Rejection Analysis
- System automatically tracks rejection reasons in Firestore
- Dashboard shows top 5 rejection reasons by frequency
- Use this data to optimize pitch and objection handling

## Using the Dashboard

### Acquisition Metrics Dashboard
Route: `/admin/acquisition-metrics`

**Overview Tab**: High-level funnel and conversion metrics
- Total contacts vs deals completed progress toward 100→10 goal
- Rejection rate percentage
- Average time to deal completion

**Funnel Tab**: Detailed conversion funnel visualization
- Bar chart showing drop-off at each stage
- Time metrics for each transition
- Identifies bottleneck stages

**Rejections Tab**: Failure analysis
- Total rejection count and rate
- Top 5 rejection reasons with frequencies
- Drives prioritization of objection handling improvements

**Customers/Freelancers Tabs**: Separate metrics by acquisition type
- Enables A/B testing different approaches
- Tracks if customers or freelancers have better conversion rates

### Lead Management Table
Route: `/admin/leads`

**Features:**
- View all leads with current funnel stage
- Filter by status: Active, Converted, Rejected, Dormant
- See days active and conversion progress
- Quick actions: Mark as converted, record rejection reason

## Daily Operations

### Morning Standup Metrics
1. Check `overall_contact_to_deal_rate` - are we on track for 10%?
2. Review new rejections - any patterns emerging?
3. Check response time - is it staying under 24 hours?
4. Identify leads at risk of going dormant (>5 days no response)

### Lead Follow-up Protocol
- **Day 1-3**: Initial contact attempt
- **Day 4-5**: Follow-up if no response (use different channel if possible)
- **Day 6+**: Mark dormant, move to re-engagement list
- **No response after 2 contact attempts**: Mark rejected

### Weekly Review
- Overall conversion rate progress
- Top rejection reasons - any new ones?
- Compare customer vs freelancer conversion rates
- Identify high-performing messaging variations

## Optimization Targets

### If conversion rate < 10%
1. **Check response rate**: If <25%, improve cold outreach messaging
2. **Check registration rate**: If <70%, simplify onboarding or improve KYC guide
3. **Check task creation rate**: If <70%, improve task creation UX or demo
4. **Check deal completion**: If <80%, improve task-freelancer matching

### If avg time to deal > 7 days
1. Accelerate KYC process (currently 3-5 days for Pi Network)
2. Send task creation reminder after registration (if <12h)
3. Offer to create first task with user (removes friction)
4. Set up faster demo call ($5 test task instead of full demo)

## Integration with Conversation Scripts

Rejection reasons map to objection handling:
- `no_pi_currency` → Use KYC Guide response
- `crypto_distrust` → Use Escrow + Reputation response
- `complexity_concern` → Use "We'll create it for you" response

Update conversation scripts when rejection rate for specific reason exceeds 20%.

## API Reference

```typescript
// Track a new lead
await AcquisitionMetricsService.trackLead({
  contact_type: 'customer',
  source: 'facebook',
  contact_name: 'John',
  contact_identifier: 'john_fb_id',
  country: 'PH',
  message_sent_at: new Date(),
  responded: false,
  registered: false,
  task_created: false,
  deal_completed: false,
  conversation_notes: 'Interested in logo design',
  demo_completed: false,
  objections_faced: [],
  status: 'active',
});

// Record response
await AcquisitionMetricsService.recordResponse(leadId);

// Record registration
await AcquisitionMetricsService.recordRegistration(leadId, 'john_pi_username');

// Record deal completion
await AcquisitionMetricsService.recordDealCompletion(leadId);

// Record rejection with reason
await AcquisitionMetricsService.recordRejection(leadId, 'no_pi_currency', 'User downloading app');

// Get metrics
const metrics = await AcquisitionMetricsService.getAcquisitionMetrics();
const customerMetrics = await AcquisitionMetricsService.getAcquisitionMetrics('customer');
```
