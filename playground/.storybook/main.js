

/** @type { import('@storybook/vue-webpack5').StorybookConfig } */
const config = {
  "stories": [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/vue-webpack5",
    "options": {}
  },
  "docs": {
    "autodocs": false
  }
};
export default config;