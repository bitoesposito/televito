import { useEffect, useState } from "react";
import TitleBox from "../../components/utility/TitleBox";
import CultureService from "../../services/culture.service";
import Content from "../../components/layout/Content";
import Loader from "../../components/utility/Loader";

export default function CulturaPage({ page = 500 }) {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if we're on a news detail page (501-599)
  const isNewsDetailPage = page > 500 && page < 600;
  const newsIndex = isNewsDetailPage ? page - 501 : null;
  const selectedNews = newsIndex !== null && newsData[newsIndex] ? newsData[newsIndex] : null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await CultureService.getCultureNews();
        setNewsData(data);
      } catch (err) {
        console.error("Failed to load culture news:", err);
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
          <TitleBox color="cyan" title="CARICAMENTO..." size="lg" />
          <p className="mt-4" style={{ color: "var(--white)" }}>Attendere...</p>
        </>
      );
    }

    if (!selectedNews || !selectedNews.title || !selectedNews.content) {
      // Calculate target page based on current page: 2xx -> 200, 3xx -> 300, 4xx -> 400, 5xx -> 500, else -> 100
      const targetPage = page >= 200 && page < 300 ? 200 : page >= 300 && page < 400 ? 300 : page >= 400 && page < 500 ? 400 : page >= 500 && page < 600 ? 500 : 100;
      return (
        <>
          <TitleBox color="cyan" title="segnale assente" size="lg" />
          <Loader time={5} blocks={10} targetPage={targetPage} />
        </>
      );
    }

    return (
      <Content
        title={selectedNews.title}
        color="cyan"
        content={selectedNews.content}
      />
    );
  }

  // Show news list for page 500
  return (
    <>
      <TitleBox color="cyan" title="500 cultura" size="lg" />
      {loading ? (
        <p className="mt-4" style={{ color: "var(--yellow)" }}>Ricerca segnale...</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {newsData.length > 0 &&
              newsData.map((item: any, index: number) => (
                <li key={index}>
                  <div className="flex gap-3">
                    <span className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                      {index + 1 < 10 ? "50" : "5"}
                      {index + 1}
                    </span>
                    <p className="uppercase">
                      {item.title}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
          {!loading && newsData.length > 0 && (
            <p className="mt-6 uppercase opacity-50" >
              digita il numero specifico per approfondire
            </p>
          )}
        </>
      )}
    </>
  );
}

