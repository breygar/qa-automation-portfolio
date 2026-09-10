import { randomUUID } from 'node:crypto';

import type { UserAccount } from '../api/types';

function purposeSlug(purpose: string): string {
  return purpose
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createTestUser(purpose: string): UserAccount {
  const uniqueId = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
  const slug = purposeSlug(purpose);

  return {
    name: `QA ${purpose} ${uniqueId}`,
    email: `qa.${slug}.${uniqueId}@example.com`,
    password: `Qa!${uniqueId}Z9`,
    title: 'Mr',
    birthDate: '1',
    birthMonth: '1',
    birthYear: '1990',
    firstName: 'QA',
    lastName: `User-${uniqueId}`,
    company: 'QA Portfolio',
    address1: '123 Test Street',
    address2: 'Suite 4',
    country: 'United States',
    zipcode: '10001',
    state: 'Test State',
    city: 'Test City',
    mobileNumber: '1000000000',
  };
}
