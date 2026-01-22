import { useEffect, useState } from "react";
import TitleBox from "../../components/utility/TitleBox";
import TvGuideService from "../../lib/tvGuide";
import Content from "../../components/layout/Content";
import Loader from "../../components/utility/Loader";
import { useNavigation } from "../../hooks/useNavigation";

export default function GuidaTvPage({ page = 300 }) {
  const [programsData, setProgramsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateToPage } = useNavigation();

  // Check if we're on a program detail page (301-399)
  const isProgramDetailPage = page > 300 && page < 400;
  const programIndex = isProgramDetailPage ? page - 301 : null;
  const selectedProgram = programIndex !== null && programsData[programIndex] ? programsData[programIndex] : null;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const data = await TvGuideService.getTvGuide();
        setProgramsData(data);
      } catch (err) {
        console.error("Failed to load TV guide:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (isProgramDetailPage) {
    if (loading) {
      return (
        <>
          <TitleBox color="green" title="CARICAMENTO..." size="lg" />
          <p className="mt-4" style={{ color: "var(--white)" }}>Attendere...</p>
        </>
      );
    }

    if (!selectedProgram || !selectedProgram.title || !selectedProgram.content) {
      // Calculate target page based on current page: 2xx -> 200, 3xx -> 300, 4xx -> 400, 5xx -> 500, else -> 100
      const targetPage = page >= 200 && page < 300 ? 200 : page >= 300 && page < 400 ? 300 : page >= 400 && page < 500 ? 400 : page >= 500 && page < 600 ? 500 : 100;
      return (
        <>
          <TitleBox color="green" title="segnale assente" size="lg" />
          <Loader time={5} blocks={10} targetPage={targetPage} />
        </>
      );
    }

    // Formatta il contenuto con informazioni aggiuntive se disponibili
    let content = selectedProgram.content;
    if (selectedProgram.channel) {
      content = `CANALE: ${selectedProgram.channel}\n\n${content}`;
    }
    if (selectedProgram.time) {
      content = `ORARIO: ${selectedProgram.time}\n\n${content}`;
    }

    return (
      <Content
        title={selectedProgram.title}
        color="green"
        content={content}
      />
    );
  }

  // Show programs list for page 300
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <TitleBox color="green" title="300 guida tv" size="lg" />
      </div>
      {loading ? (
        <p className="mt-4" style={{ color: "var(--yellow)" }}>Ricerca segnale...</p>
      ) : (
        <div className="flex-1">
          <ul className="mt-4">
            {programsData.length > 0 &&
              programsData.map((program: any, index: number) => {
                const detailPage = 301 + index;
                return (
                  <li 
                    key={index}
                    onClick={() => navigateToPage(detailPage)}
                    className="p-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? "transparent" : "rgba(128, 128, 128, 0.2)"
                    }}
                  >
                    <div className="flex gap-3">
                      <span className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                        {index + 1 < 10 ? "30" : "3"}
                        {index + 1}
                      </span>
                      <div className="flex flex-col flex-1">
                        <div className="flex">
                          {(program.time || program.onair) && (
                            <p className="w-[4rem]" style={{ color: "var(--cyan)" }}>
                              {(program.time || program.onair || "").split(' ')[1] || (program.time || program.onair || "")}
                            </p>
                          )}
                          {program.channel && (
                            <p className="truncate" style={{ color: "var(--cyan)" }}>
                              | {program.channel}
                            </p>
                          )}
                        </div>
                        <p className="uppercase">
                          {program.title}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
          {!loading && programsData.length > 0 && (
            <p className="mt-6 uppercase opacity-50" >
              digita il numero specifico per approfondire
            </p>
          )}
        </div>
      )}
    </div>
  );
}
