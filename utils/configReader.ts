import dotenv from 'dotenv';
import { resolve } from 'node:path';

export type EnvironmentName = 'dev' | 'qa' | 'staging';
export type BrowserName = 'chromium' | 'firefox' | 'webkit';

const supportedEnvironments: EnvironmentName[] = ['dev', 'qa', 'staging'];
const shellEnvironment = { ...process.env };

dotenv.config({ path: resolve(process.cwd(), '.env') });

const selectedEnvironment = (shellEnvironment.ENV ?? process.env.ENV ?? 'qa').toLowerCase();

if (!supportedEnvironments.includes(selectedEnvironment as EnvironmentName)) {
  throw new Error(
    `Unsupported ENV "${selectedEnvironment}". Choose one of: ${supportedEnvironments.join(', ')}`,
  );
}

export const environmentName = selectedEnvironment as EnvironmentName;
const environmentFile = resolve(process.cwd(), 'config', `${environmentName}.env`);
const environmentFileResult = dotenv.config({ path: environmentFile, override: true });

if (environmentFileResult.error) {
  throw new Error(`Unable to load environment configuration: ${environmentFile}`);
}

for (const [key, value] of Object.entries(shellEnvironment)) {
  if (value !== undefined) {
    process.env[key] = value;
  }
}

function getPositiveNumber(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return value;
}

const browser = process.env.BROWSER ?? 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(browser)) {
  throw new Error(`Unsupported BROWSER "${browser}". Choose chromium, firefox, or webkit.`);
}

function getBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  }
  if (value.toLowerCase() === 'false') {
    return false;
  }
  throw new Error(`${name} must be "true" or "false"`);
}

export const frameworkConfig = {
  environment: environmentName,
  baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com/web/index.php/',
  browser: browser as BrowserName,
  headless: getBoolean('HEADLESS', true),
  timeout: getPositiveNumber('TIMEOUT', 30000),
  expectTimeout: getPositiveNumber('EXPECT_TIMEOUT', 5000),
  actionTimeout: getPositiveNumber('ACTION_TIMEOUT', 10000),
  navigationTimeout: getPositiveNumber('NAVIGATION_TIMEOUT', 20000),
  workers: getPositiveNumber('WORKERS', 1),
};
