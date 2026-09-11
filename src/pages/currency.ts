export function parseCurrencyAmount(value: string, context: string): number {
  const match = value.match(/\d[\d,]*(?:\.\d+)?/);
  const amount = match ? Number(match[0].replace(/,/g, '')) : Number.NaN;

  if (!Number.isFinite(amount)) {
    throw new Error(`${context} did not contain a valid amount: "${value}".`);
  }

  return amount;
}
