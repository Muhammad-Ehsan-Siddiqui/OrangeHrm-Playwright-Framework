import loginDataJson from '../test-data/loginData.json';

export interface Credentials {
  username: string;
  password: string;
}

export interface LoginTestData {
  validLogin: Credentials;
  invalidLogin: Credentials;
  invalidUsername: Credentials;
  invalidPassword: Credentials;
  emptyUsername: Credentials;
  emptyPassword: Credentials;
  emptyCredentials: Credentials;
}

function isCredentials(value: unknown): value is Credentials {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const credentials = value as Record<string, unknown>;
  return typeof credentials.username === 'string' && typeof credentials.password === 'string';
}

export function readLoginTestData(): LoginTestData {
  const data: unknown = loginDataJson;
  if (typeof data !== 'object' || data === null) {
    throw new Error('Login test data must be a JSON object');
  }

  const loginData = data as Record<string, unknown>;
  const cases: (keyof LoginTestData)[] = [
    'validLogin',
    'invalidLogin',
    'invalidUsername',
    'invalidPassword',
    'emptyUsername',
    'emptyPassword',
    'emptyCredentials',
  ];

  for (const testCase of cases) {
    if (!isCredentials(loginData[testCase])) {
      throw new Error(`Login test data case "${testCase}" is missing or invalid`);
    }
  }

  return loginData as unknown as LoginTestData;
}
