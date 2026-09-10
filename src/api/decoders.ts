export function asRecord(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${context} must be an object.`);
  }

  return value as Record<string, unknown>;
}

export function readNumber(record: Record<string, unknown>, key: string, context: string): number {
  const value = record[key];

  if (typeof value !== 'number') {
    throw new Error(`${context}.${key} must be a number.`);
  }

  return value;
}

export function readString(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key];

  if (typeof value !== 'string') {
    throw new Error(`${context}.${key} must be a string.`);
  }

  return value;
}
