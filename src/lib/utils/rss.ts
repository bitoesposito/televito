import { useState, useEffect } from "react";
import CacheService from "./cache";
import type { RssData } from "../../types/televideo";

const API_URL = "https://api.rss2json.com/v1/api.json";

export function useRss(rssUrl: string) {
	const [data, setData] = useState<RssData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!rssUrl) {
			setLoading(false);
			return;
		}

		const fetchRss = async () => {
			try {
				setLoading(true);
				setError(null);

				const cacheKey = `rss:${rssUrl}`;
				
				const rssData = await CacheService.get<RssData>(cacheKey, async () => {
					const response = await fetch(`${API_URL}?rss_url=${encodeURIComponent(rssUrl)}`);
					
					if (!response.ok) {
						throw new Error(`Failed to fetch RSS: ${response.statusText}`);
					}
					
					const data = await response.json();
					
					if (data.status !== "ok") {
						throw new Error("Failed to parse RSS feed");
					}
					
					return data;
				});

				setData(rssData);
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Unknown error"));
			} finally {
				setLoading(false);
			}
		};

		fetchRss();
	}, [rssUrl]);

	return { data, loading, error };
}
