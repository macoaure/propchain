import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    // Disable the eslint rule for unused parameters by using an empty function without parameters
    setupNodeEvents() {
      // implement node event listeners here when needed
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
