import { nextUsageInfo } from '@/service/usage-service';

export async function getNextUsage() {
  const currentNextUsage = await nextUsageInfo();
  return currentNextUsage;
}
