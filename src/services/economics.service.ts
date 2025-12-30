import RssService from "./rss.service";

export default class EconomicsService {
    private static readonly RSS_URL = "https://www.servizitelevideo.rai.it/televideo/pub/rss130.xml";

    public static async getEconomicsNews(maxItems: number = 10) {
        const rssData = await RssService.getRss(EconomicsService.RSS_URL);
        
        if (!rssData.items || rssData.items.length === 0) {
            throw new Error("No economics news items found in RSS feed");
        }
        
        return rssData.items.slice(0, maxItems);
    }
}


