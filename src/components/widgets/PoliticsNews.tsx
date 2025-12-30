import { useEffect, useState } from "react";
import TitleBox from "../utility/TitleBox";
import PoliticsService from "../../services/politics.service";

export default function PoliticsNewsWidget() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    PoliticsService.getPoliticsNews(3)
      .then((data) => setNewsData(data))
      .catch((err) => {
        console.error("Failed to load politics news:", err);
      });
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="green" title="politica (notizie)" size="md" className="mb-2" />
      <ul className="mb-2">
        {newsData.map((item: any, index: number) => (
          <li key={index}>
            <div className="flex gap-3">
              <span className="w-7 text-center" style={{ color: "var(--green)" }}>
                {index + 1 < 10 ? "30" : "3"}
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
        title="vedi tutte (P. 300) >>"
        size="md"
        centerText={true}
        className="mt-2"
      />
    </div>
  );
}

