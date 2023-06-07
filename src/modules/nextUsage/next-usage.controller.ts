import { nextUsageInfo } from './next-usage.service';

export async function getNextUsage() {
  const currentNextUsage = await nextUsageInfo();
  return currentNextUsage;
}
