const cache = {
  extLists: null,
  navLists: null,
  lastFetch: {
    extLists: 0,
    navLists: 0
  },
  ttl: 15 * 60 * 1000 // Cache expiry: 15 minutes
};

/**
 * Fetches data from an API and caches the result.
 * @param {string} key - The cache key (`extLists` or `navLists`).
 * @param {string} apiUrl - The API endpoint to fetch from.
 * @returns {Promise<Object>} - The fetched data.
 */
export async function getCachedData(key, apiUrl) {
  const now = Date.now();
  if (cache[key] && now - cache.lastFetch[key] < cache.ttl) { return cache[key]; }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    cache[key] = data;
    cache.lastFetch[key] = now;
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return cache[key] || {};
  }
}