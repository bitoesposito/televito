import RssService from "./rss.service";

export default class CultureService {
    private static readonly RSS_URL = "https://www.servizitelevideo.rai.it/televideo/pub/rss160.xml";

    public static async getCultureNews(maxItems: number = 10) {
        const rssData = await RssService.getRss(CultureService.RSS_URL);
        
        if (!rssData.items || rssData.items.length === 0) {
            throw new Error("No culture news items found in RSS feed");
        }
        
        return rssData.items.slice(0, maxItems);
    }
}

