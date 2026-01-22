import { useMemo } from "react";
import { useRss } from "./utils/rss";

const RSS_URL = "https://www.servizitelevideo.rai.it/televideo/pub/rss130.xml";

export function useEconomicsNews(maxItems: number = 10) {
	const { data, loading, error } = useRss(RSS_URL);

	const news = useMemo(() => {
		if (!data?.items || data.items.length === 0) {
			return [];
		}
		return data.items.slice(0, maxItems);
	}, [data, maxItems]);

	return { news, loading, error };
}
