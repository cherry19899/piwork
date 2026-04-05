import type { Meta, StoryObj } from '@storybook/react';
import { AccessibleButton, AccessibleCard, AccessibleBadge, AccessibleAvatar, AccessibleIcon, AccessibleInput, AccessibleTextarea, AccessibleSelect } from '@/components/ui/index';

const meta = {
  title: 'Accessibility/Overview',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<{}>;

export default meta;

export const AccessibilityChecklist = {
  render: () => (
    <div style={{ maxWidth: 600, padding: 24, backgroundColor: '#1A1A1A', borderRadius: 8 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Accessibility Features
      </h1>
      
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Vision</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Minimum 4.5:1 contrast ratio for all text</li>
          <li>Color-coded states with additional visual indicators</li>
          <li>Responsive text sizing with system settings</li>
          <li>Clear visual focus indicators (2px purple outline)</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Motor & Interaction</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Minimum 48×48px touch targets</li>
          <li>Full keyboard navigation support</li>
          <li>Logical tab order</li>
          <li>Respects prefers-reduced-motion</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Hearing & Cognition</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>No sound-only content</li>
          <li>Clear, simple language</li>
          <li>Consistent navigation patterns</li>
          <li>Error messages with suggestions</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Screen Readers</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Semantic HTML and ARIA labels</li>
          <li>Descriptive button text</li>
          <li>Form labels linked to inputs</li>
          <li>Live regions for dynamic content</li>
        </ul>
      </section>
    </div>
  ),
};

export const ComponentVariants = {
  render: () => (
    <div style={{ maxWidth: 800, padding: 24, backgroundColor: '#1A1A1A', borderRadius: 8 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Available Components</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Buttons</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            primary | secondary | danger | ghost
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            sm | md | lg
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            loading | disabled
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Inputs</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Text | Number | Email | Password
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Textarea | Select
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Error states | Validation
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Content</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Card (task | user | review)
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Badge (status | notification | rating)
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Avatar (sm | md | lg)
          </div>
          <div style={{ padding: 8, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
            Icon (compact | default)
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Testing in Storybook</h2>
        <div style={{ padding: 16, backgroundColor: '#2A2A2A', borderRadius: 4 }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            1. Use the <strong>Accessibility panel</strong> to check contrast, ARIA attributes, and violations<br/>
            2. Test <strong>keyboard navigation</strong> with Tab, Shift+Tab, Enter, and Space<br/>
            3. Enable <strong>prefers-reduced-motion</strong> in your OS settings<br/>
            4. Test with <strong>screen reader</strong> on mobile and desktop
          </p>
        </div>
      </section>
    </div>
  ),
};
