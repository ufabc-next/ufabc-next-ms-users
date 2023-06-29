export async function getOauthInfo(url: string, opts: RequestInit) {
  try {
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(
        `Unknown Request Error ${response.status} ${JSON.stringify(
          await response.json(),
        )}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[ERROR] fetch error', error);
    throw error;
  }
}
