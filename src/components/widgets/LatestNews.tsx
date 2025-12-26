import { useEffect, useState } from "react";
import TitleBox from "../utility/TitleBox";
import NewsService from "../../services/news.service";

export default function LastNewsWidget() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    NewsService.getNews(3)
      .then((data) => setNewsData(data))
      .catch((err) => {
        console.error("Failed to load news:", err);
      });
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500">
      <TitleBox color="yellow" title="ultim'ora" size="md" className="mb-2" />
      <ul className="mb-2">
        {newsData.map((item: any, index: number) => (
          <li key={index}>
            <div className="flex gap-2 justify-between">
              <span style={{ color: "var(--yellow)" }}>
                {index + 1 < 10 ? "20" : "2"}
                {index + 1}
              </span>
              <p className="uppercase" style={{ color: "var(--cyan)" }}>
                {item.title || "Nessun titolo"}
              </p>
            </div>
          </li>
        ))}
        {newsData.length === 0 && (
          <p style={{ color: "var(--cyan)" }}>RICERCA SEGNALE IN CORSO...</p>
        )}
      </ul>
      <TitleBox
        color="white"
        title="vedi tutte (P. 200) >>"
        size="md"
        centerText={true}
        className="mt-2"
      />
    </div>
  );
}
