'use client';

import type { Meta, StoryObj } from '@storybook/react';
import {
  AccessibleCard,
  AccessibleBadge,
  AccessibleAvatar,
  AccessibleIcon,
} from '@/components/ui/accessible-card';

const cardMeta = {
  title: 'Components/Card',
  component: AccessibleCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibleCard>;

export default cardMeta;
type CardStory = StoryObj<typeof cardMeta>;

export const TaskCard: CardStory = {
  args: {
    variant: 'task',
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
          Write product descriptions
        </h3>
        <p style={{ margin: 0, marginBottom: 16, color: '#999' }}>
          100 product descriptions for e-commerce store
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#8B5CF6' }}>45π</span>
          <span style={{ fontSize: 12, color: '#999' }}>2 days left</span>
        </div>
      </div>
    ),
    ariaLabel: 'Task: Write product descriptions for 45 Pi, 2 days remaining',
  },
};

export const UserCard: CardStory = {
  args: {
    variant: 'user',
    children: (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          👤
        </div>
        <h3 style={{ margin: 0, marginBottom: 4, fontSize: 16, fontWeight: 700 }}>
          designer_pro
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: '#999' }}>★★★★★ (4.9)</p>
        <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#999' }}>
          24 tasks completed
        </p>
      </div>
    ),
    ariaLabel: 'User profile: designer_pro with 4.9 star rating and 24 completed tasks',
  },
};

export const ReviewCard: CardStory = {
  args: {
    variant: 'review',
    children: (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>TechStore</span>
          <span style={{ color: '#FBBF24', letterSpacing: 1 }}>★★★★★</span>
        </div>
        <p style={{ margin: 0, color: '#999', lineHeight: 1.5 }}>
          Excellent work! Very professional and fast delivery. Highly recommended!
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: 10, color: '#666' }}>2 days ago</p>
      </div>
    ),
    ariaLabel: 'Review from TechStore: 5 stars - Excellent work! Very professional and fast delivery.',
  },
};

const badgeMeta = {
  title: 'Components/Badge',
  component: AccessibleBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibleBadge>;

export const StatusBadge = {
  render: () => <AccessibleBadge variant="status">Active</AccessibleBadge>,
};

export const NotificationBadge = {
  render: () => (
    <AccessibleBadge variant="notification" ariaLabel="3 unread messages">
      3
    </AccessibleBadge>
  ),
};

export const RatingBadge = {
  render: () => <AccessibleBadge variant="rating">4.9 ★</AccessibleBadge>,
};

const avatarMeta = {
  title: 'Components/Avatar',
  component: AccessibleAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibleAvatar>;

export const SmallAvatar = {
  render: () => <AccessibleAvatar size="sm" alt="User avatar" initials="JD" />,
};

export const MediumAvatar = {
  render: () => <AccessibleAvatar size="md" alt="User avatar" initials="JD" />,
};

export const LargeAvatar = {
  render: () => <AccessibleAvatar size="lg" alt="User avatar" initials="JD" />,
};

const iconMeta = {
  title: 'Components/Icon',
  component: AccessibleIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibleIcon>;

export const DefaultIcon = {
  render: () => <AccessibleIcon icon="💼" label="Work" />,
};

export const CompactIcon = {
  render: () => <AccessibleIcon icon="✓" label="Completed" size="compact" />,
};

export const HiddenIcon = {
  render: () => <AccessibleIcon icon="→" label="Arrow" ariaHidden />,
};
