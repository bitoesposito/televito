import { useEffect, useState } from "react";
import TitleBox from "../../components/utility/TitleBox";
import EconomicsService from "../../services/economics.service";
import Content from "../../components/layout/Content";
import Loader from "../../components/utility/Loader";

export default function EconomiaPage({ page = 400 }) {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if we're on a news detail page (401-499)
  const isNewsDetailPage = page > 400 && page < 500;
  const newsIndex = isNewsDetailPage ? page - 401 : null;
  const selectedNews = newsIndex !== null && newsData[newsIndex] ? newsData[newsIndex] : null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await EconomicsService.getEconomicsNews();
        setNewsData(data);
      } catch (err) {
        console.error("Failed to load economics news:", err);
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
          <TitleBox color="red" title="CARICAMENTO..." size="lg" />
          <p className="mt-4" style={{ color: "var(--white)" }}>Attendere...</p>
        </>
      );
    }

    if (!selectedNews || !selectedNews.title || !selectedNews.content) {
      // Calculate target page based on current page: 2xx -> 200, 3xx -> 300, 4xx -> 400, 5xx -> 500, else -> 100
      const targetPage = page >= 200 && page < 300 ? 200 : page >= 300 && page < 400 ? 300 : page >= 400 && page < 500 ? 400 : page >= 500 && page < 600 ? 500 : 100;
      return (
        <>
          <TitleBox color="red" title="segnale assente" size="lg" />
          <Loader time={5} blocks={10} targetPage={targetPage} />
        </>
      );
    }

    return (
      <Content
        title={selectedNews.title}
        color="red"
        content={selectedNews.content}
      />
    );
  }

  // Show news list for page 400
  return (
    <>
      <TitleBox color="red" title="400 economia" size="lg" />
      {loading ? (
        <p className="mt-4" style={{ color: "var(--yellow)" }}>Ricerca segnale...</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {newsData.length > 0 &&
            newsData.map((item: any, index: number) => (
              <li key={index}>
                <div className="flex gap-3">
                  <span className="w-[3rem]" style={{ color: "var(--red)" }}>
                    {index + 1 < 10 ? "40" : "4"}
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

