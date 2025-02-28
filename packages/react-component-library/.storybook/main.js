const newRelic = require('./newRelic')

module.exports = {
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
  ],
  core: {
    builder: 'webpack5',
  },
  previewHead: (head) => `
    ${head}
    ${process.env.NETLIFY ? newRelic.script : ''}
  `,
  stories: ['../src/**/*.stories.tsx'],
}
