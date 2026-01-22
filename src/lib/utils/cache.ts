import type { CacheEntry } from "../../types/televideo";

export default class CacheService {
    private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
    private static cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * Gets data from cache if still valid, otherwise executes the function and saves the result
     * @param key Unique key for the cache
     * @param fetchFunction Function that executes the API call if data is not in cache or expired
     * @returns Data from cache or from API call
     */
    public static async get<T>(
        key: string,
        fetchFunction: () => Promise<T>
    ): Promise<T> {
        const cached = CacheService.cache.get(key);
        const now = Date.now();

        // If data is in cache and still valid, return it
        if (cached && (now - cached.timestamp) < CacheService.CACHE_DURATION) {
            return cached.data;
        }

        // Otherwise, execute API call and save the result
        try {
            const data = await fetchFunction();
            CacheService.cache.set(key, {
                data,
                timestamp: now
            });
            return data;
        } catch (error) {
            // If the call fails and we have cached data (even expired), return it as fallback
            if (cached) {
                console.warn(`API call failed for ${key}, using stale cache data`);
                return cached.data;
            }
            throw error;
        }
    }

    /**
     * Invalidates cache for a specific key
     * @param key Key to invalidate
     */
    public static invalidate(key: string): void {
        CacheService.cache.delete(key);
    }

    /**
     * Clears all cache
     */
    public static clear(): void {
        CacheService.cache.clear();
    }
}
