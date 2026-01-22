import TitleBox from "../utility/TitleBox";
import { useCultureNews } from "../../lib/culture";
import { useNavigation } from "../../hooks/useNavigation";

export default function CultureNewsWidget() {
  const { news: newsData } = useCultureNews(3);
  const { navigateToPage } = useNavigation();

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="cyan" title="cultura (notizie)" size="md" className="mb-2" />
      <ul className="mb-2">
        {newsData.map((item: any, index: number) => (
          <li key={index}>
            <div className="flex gap-3 mb-2">
              <span className="w-[2.5rem]" style={{ color: "var(--yellow)" }}>
                {index + 1 < 10 ? "50" : "5"}
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
        onClick={() => navigateToPage(500)}
        color="white"
        title="vedi tutte (P. 500) >>"
        size="md"
        centerText={true}
        className="mt-2 cursor-pointer"
      />
    </div>
  );
}

