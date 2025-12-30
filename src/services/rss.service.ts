import CacheService from "./cache.service";

export default class RssService {
    private static readonly API_URL = "https://api.rss2json.com/v1/api.json";

    public static async getRss(rssUrl: string) {
        const cacheKey = `rss:${rssUrl}`;
        
        return CacheService.get(cacheKey, async () => {
            const response = await fetch(`${RssService.API_URL}?rss_url=${encodeURIComponent(rssUrl)}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch RSS: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.status !== "ok") {
                throw new Error("Failed to parse RSS feed");
            }
            
            return data;
        });
    }
}