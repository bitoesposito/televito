import RssService from "./rss.service";

export default class PoliticsService {
    private static readonly RSS_URL = "https://www.servizitelevideo.rai.it/televideo/pub/rss120.xml";

    public static async getPoliticsNews(maxItems: number = 10) {
        const rssData = await RssService.getRss(PoliticsService.RSS_URL);
        
        if (!rssData.items || rssData.items.length === 0) {
            throw new Error("No politics news items found in RSS feed");
        }
        
        return rssData.items.slice(0, maxItems);
    }
}

