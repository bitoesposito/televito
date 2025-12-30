import { useEffect, useState } from "react";
import TitleBox from "../utility/TitleBox";
import CultureService from "../../services/culture.service";

export default function CultureNewsWidget() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    CultureService.getCultureNews(3)
      .then((data) => setNewsData(data))
      .catch((err) => {
        console.error("Failed to load culture news:", err);
      });
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="cyan" title="cultura (notizie)" size="md" className="mb-2" />
      <ul className="mb-2">
        {newsData.map((item: any, index: number) => (
          <li key={index}>
            <div className="flex gap-3">
              <span className="w-7 text-center" style={{ color: "var(--cyan)" }}>
                {index + 1 < 10 ? "50" : "5"}
                {index + 1}
              </span>
              <p className="uppercase" style={{ color: "var(--cyan)" }}>
                {item.title || "Nessun titolo"}
              </p>
            </div>
          </li>
        ))}
        {newsData.length === 0 && (
          <p style={{ color: "var(--yellow)" }}>RICERCA SEGNALE IN CORSO...</p>
        )}
      </ul>
      <TitleBox
        color="white"
        title="vedi tutte (P. 500) >>"
        size="md"
        centerText={true}
        className="mt-2"
      />
    </div>
  );
}

