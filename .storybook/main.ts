import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.tsx', '../components/**/*.stories.ts'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
};
export default config;
