import { useEffect, useState } from "react";
import TitleBox from "../../components/utility/TitleBox";
import NewsService from "../../services/news.service";
import Content from "../../components/layout/Content";
import Loader from "../../components/utility/Loader";

export default function NotiziePage({ page = 200 }) {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if we're on a news detail page (201-299)
  const isNewsDetailPage = page > 200 && page < 300;
  const newsIndex = isNewsDetailPage ? page - 201 : null;
  const selectedNews = newsIndex !== null && newsData[newsIndex] ? newsData[newsIndex] : null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await NewsService.getNews();
        setNewsData(data);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isNewsDetailPage) {
    if (loading) {
      return (
        <>
          <TitleBox color="yellow" title="CARICAMENTO..." size="lg" />
          <p className="mt-4" style={{ color: "var(--white)" }}>Attendere...</p>
        </>
      );
    }

    if (!selectedNews || !selectedNews.title || !selectedNews.content) {
      // Calculate target page based on current page: 2xx -> 200, 3xx -> 300, 4xx -> 400, 5xx -> 500, else -> 100
      const targetPage = page >= 200 && page < 300 ? 200 : page >= 300 && page < 400 ? 300 : page >= 400 && page < 500 ? 400 : page >= 500 && page < 600 ? 500 : 100;
      return (
        <>
          <TitleBox color="yellow" title="segnale assente" size="lg" />
          <Loader time={5} blocks={10} targetPage={targetPage} />
        </>
      );
    }

    return (
      <Content
        title={selectedNews.title}
        color="yellow"
        content={selectedNews.content}
      />
    );
  }

  // Show news list for page 200
  return (
    <>
      <TitleBox color="yellow" title="200 notizie" size="lg" />
      {loading ? (
        <p className="mt-4" style={{ color: "var(--yellow)" }}>Ricerca segnale...</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {newsData.length > 0 &&
            newsData.map((item: any, index: number) => (
              <li key={index}>
                <div className="flex gap-3">
                  <span className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                    {index + 1 < 10 ? "20" : "2"}
                    {index + 1}
                  </span>
                  <p className="uppercase">
                    {item.title}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
