import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    retries: {
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});