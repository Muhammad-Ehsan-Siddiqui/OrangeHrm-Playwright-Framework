# OrangeHRM Playwright Tests

A beginner-friendly Playwright Test framework written in TypeScript for testing the OrangeHRM demo login page.

Application under test:

https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

## Prerequisites

- Node.js 18 or newer
- npm

## Installation

Clone the repository and install the dependencies:

```bash
npm install
npx playwright install chromium
```

## Run Tests

Run all tests in headless Chromium mode:

```bash
npm test
```

Run the tests in headed mode:

```bash
npx playwright test --headed
```

Run only the login tests:

```bash
npx playwright test tests/login.spec.ts
```

Run a specific test by name:

```bash
npx playwright test -g "valid login"
```

## Project Structure

```text
pages/
  LoginPage.ts           # Page Object Model for the login page
  DashboardPage.ts       # Page Object Model for the dashboard

fixtures/
  testFixtures.ts        # Custom LoginPage and DashboardPage fixtures

tests/
  login.spec.ts          # Login test scenarios

playwright.config.ts     # Playwright Test configuration
package.json             # Project scripts and dependencies
tsconfig.json            # TypeScript configuration
```

## Test Scenarios

The test suite covers:

1. Successful login with `Admin` and `admin123`.
2. Invalid login and verification of the `Invalid credentials` message.
3. Verification of the login page title.

## Fixture Flow

The custom fixture keeps page-object creation out of the test cases:

```text
Playwright page fixture
        |
        v
LoginPage and DashboardPage fixtures
        |
        v
Tests use page objects
```

`testFixtures.ts` extends Playwright's built-in `test` object with `loginPage` and `dashboardPage` fixtures. Each fixture receives Playwright's built-in `page`, creates its page-object instance, and provides it to the tests.

The valid-login flow uses `loginPage` to authenticate, then uses `dashboardPage` to verify that the Dashboard heading is displayed.

## Design Notes

- Login locators are contained in `LoginPage`.
- Dashboard locators and dashboard actions are contained in `DashboardPage`.
- Locators use accessible roles and names.
- Playwright auto-waiting and web-first assertions are used.
- No hard-coded waits or `page.waitForTimeout()` are used.
- The framework intentionally does not include advanced features such as base pages, external test data, logging, retries, or reporting integrations.
