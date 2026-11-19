import { defineConfig, devices } from '@playwright/test';

const poort = 4173;
// lokaal kan een al geïnstalleerde Chrome gebruikt worden: PW_CHROME=/usr/bin/google-chrome
const executablePath = process.env.PW_CHROME || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${poort}/rekentoets-pabo/`,
    trace: 'retain-on-failure',
    launchOptions: { executablePath },
  },
  // alleen Chromium, in licht en donker, op telefoon- en desktopbreedte
  projects: [
    { name: '390-licht', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, colorScheme: 'light' } },
    { name: '390-donker', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, colorScheme: 'dark' } },
    { name: '1280-licht', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, colorScheme: 'light' } },
    { name: '1280-donker', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, colorScheme: 'dark' } },
  ],
  webServer: {
    // met een voorbeeldlink, zodat de steunknop ook getest wordt; zonder teller
    command: `VITE_STEUN_URL=https://example.org/steun npx vite build && npx vite preview --port ${poort} --strictPort`,
    url: `http://localhost:${poort}/rekentoets-pabo/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
