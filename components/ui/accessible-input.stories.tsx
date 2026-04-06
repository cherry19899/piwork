'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect } from '@/components/ui/accessible-input';

const meta = {
  title: 'Components/Input',
  component: AccessibleInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    type: 'text',
  },
};

export const EmailInput: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    required: true,
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Budget',
    placeholder: 'Enter budget',
    type: 'number',
  },
};

export const InputWithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text',
    error: 'Username is already taken',
  },
};

export const Textarea: Story = {
  render: () => (
    <AccessibleTextarea
      label="Description"
      placeholder="Enter task description"
      rows={4}
      required
    />
  ),
};

export const TextareaWithError: Story = {
  render: () => (
    <AccessibleTextarea
      label="Feedback"
      placeholder="Enter your feedback"
      error="Feedback must be at least 10 characters"
    />
  ),
};

export const Select: Story = {
  render: () => (
    <AccessibleSelect
      label="Category"
      options={[
        { value: 'design', label: 'Design' },
        { value: 'writing', label: 'Writing' },
        { value: 'data', label: 'Data Entry' },
        { value: 'audio', label: 'Audio' },
      ]}
      required
    />
  ),
};
