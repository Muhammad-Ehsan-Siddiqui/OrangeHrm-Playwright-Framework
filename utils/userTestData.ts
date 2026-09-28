import { faker } from '@faker-js/faker';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { NewSystemUser } from '../pages/AdminUsersPage';

export type NewUserTestData = NewSystemUser & {
  employeeId: string;
  firstName: string;
  lastName: string;
};

const createdUserFile = resolve(process.cwd(), 'test-data', 'createdUser.json');

export function createNewUserTestData(): NewUserTestData {
  const uniquePart = faker.string.uuid().replaceAll('-', '').slice(0, 12).toLowerCase();
  const firstName = faker.person.firstName();
  const lastName = `${faker.person.lastName()}${uniquePart.slice(0, 4)}`;

  return {
    employeeId: faker.string.numeric(8),
    firstName,
    lastName,
    employeeName: `${firstName} ${lastName}`,
    username: `qa_${uniquePart}`,
    password: `Aa1!${uniquePart}`,
  };
}

export async function saveCreatedUserTestData(user: NewUserTestData): Promise<void> {
  await mkdir(dirname(createdUserFile), { recursive: true });
  await writeFile(createdUserFile, `${JSON.stringify(user, null, 2)}\n`, 'utf8');
}

export async function loadCreatedUserTestData(): Promise<NewUserTestData> {
  const fileContents = await readFile(createdUserFile, 'utf8');
  const user: unknown = JSON.parse(fileContents);

  if (!isNewUserTestData(user)) {
    throw new Error(`Saved user data in ${createdUserFile} is invalid`);
  }

  return user;
}

function isNewUserTestData(value: unknown): value is NewUserTestData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return [
    'employeeId',
    'firstName',
    'lastName',
    'employeeName',
    'username',
    'password',
  ].every((field) => typeof user[field] === 'string');
}
