import { useEffect, useState } from "react";
import TitleBox from "../utility/TitleBox";
import TvGuideService from "../../services/tvguide.service";

export default function TvGuideWidget() {
  const [programsData, setProgramsData] = useState<any[]>([]);

  useEffect(() => {
    TvGuideService.getTvGuide(3)
      .then((data) => setProgramsData(data))
      .catch((err) => {
        console.error("Failed to load TV guide:", err);
      });
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="green" title="guida tv" size="md" className="mb-2" />
      <ul className="mb-2">
        {programsData.map((program: any, index: number) => (
          <li key={index}>
            <div className="flex flex-col">
              <div className="flex gap-3">
                {(program.time || program.onair) && (
                  <span className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                    {(program.time || program.onair || "").split(' ')[1] || (program.time || program.onair || "")}
                  </span>
                )}
                {program.channel && (
                  <span className="truncate" style={{ color: "var(--cyan)" }}>
                    {program.channel}
                  </span>
                )}
              </div>
              <p className="uppercase" style={{ color: "var(--white)" }}>
                {program.title || "Nessun titolo"}
              </p>
            </div>
          </li>
        ))}
        {programsData.length === 0 && (
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

