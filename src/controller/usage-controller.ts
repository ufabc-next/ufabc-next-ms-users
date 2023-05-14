export async function getNextUsage() {
  const currentNextUsage = await nextUsageInfo();
  return currentNextUsage;
}
