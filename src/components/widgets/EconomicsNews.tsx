import { useEffect, useState } from "react";
import TitleBox from "../utility/TitleBox";
import EconomicsService from "../../services/economics.service";

export default function EconomicsNewsWidget() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    EconomicsService.getEconomicsNews(3)
      .then((data) => setNewsData(data))
      .catch((err) => {
        console.error("Failed to load economics news:", err);
      });
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="red" title="economia (notizie)" size="md" className="mb-2" />
      <ul className="mb-2">
        {newsData.map((item: any, index: number) => (
          <li key={index}>
            <div className="flex gap-3">
              <span className="w-7 text-center" style={{ color: "var(--yellow)" }}>
                {index + 1 < 10 ? "40" : "4"}
                {index + 1}
              </span>
              <p className="uppercase" style={{ color: "var(--white)" }}>
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
        title="vedi tutte (P. 400) >>"
        size="md"
        centerText={true}
        className="mt-2"
      />
    </div>
  );
}


