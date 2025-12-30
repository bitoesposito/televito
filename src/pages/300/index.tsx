import { useEffect, useState, useRef } from "react";
import TitleBox from "../../components/utility/TitleBox";
import TvGuideService from "../../services/tvguide.service";
import Content from "../../components/layout/Content";
import Loader from "../../components/utility/Loader";

export default function GuidaTvPage({ page = 300 }) {
  const [programsData, setProgramsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // Inizializza con un valore conservativo
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const measurementRef = useRef<HTMLUListElement>(null);
  const isInitializedRef = useRef(false);
  const currentVisibleCountRef = useRef(10);

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

  // Calcola quanti elementi possono essere mostrati
  useEffect(() => {
    if (loading || programsData.length === 0) return;

    const checkVisibility = () => {
      if (!containerRef.current || !titleRef.current || !measurementRef.current) {
        return;
      }

      const containerHeight = containerRef.current.offsetHeight;
      const titleHeight = titleRef.current.offsetHeight;
      const availableHeight = containerHeight - titleHeight;

      // Usa doppio requestAnimationFrame per assicurarsi che il DOM sia completamente renderizzato
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!measurementRef.current) return;

          const measurementList = measurementRef.current;
          const items = Array.from(measurementList.children) as HTMLElement[];
          
          if (items.length === 0) {
            setTimeout(checkVisibility, 50);
            return;
          }

          // Misura l'altezza di ogni elemento
          const itemHeights: number[] = [];
          items.forEach((item) => {
            const height = item.offsetHeight;
            if (height > 0) {
              itemHeights.push(height);
            }
          });

          if (itemHeights.length === 0) {
            setTimeout(checkVisibility, 50);
            return;
          }

          // Calcola quanti elementi possono entrare nello spazio disponibile
          let accumulatedHeight = 0;
          let visibleCount = 0;

          for (let i = 0; i < itemHeights.length; i++) {
            if (accumulatedHeight + itemHeights[i] <= availableHeight) {
              accumulatedHeight += itemHeights[i];
              visibleCount++;
            } else {
              break;
            }
          }

          // Aggiorna solo se è cambiato qualcosa o se è la prima inizializzazione
          if (!isInitializedRef.current || visibleCount !== currentVisibleCountRef.current) {
            currentVisibleCountRef.current = visibleCount;
            setVisibleCount(visibleCount);
            isInitializedRef.current = true;
          }
        });
      });
    };

    // Initial check with a small delay
    const timeoutId = setTimeout(() => {
      checkVisibility();
    }, 100);

    // Use ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      checkVisibility();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }
    if (measurementRef.current) {
      resizeObserver.observe(measurementRef.current);
    }

    // Also listen to window resize
    window.addEventListener("resize", checkVisibility);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkVisibility);
    };
  }, [loading, programsData]);

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
    <div ref={containerRef} className="flex flex-col h-full overflow-hidden">
      <div ref={titleRef} className="flex-shrink-0">
        <TitleBox color="green" title="300 guida tv" size="lg" />
      </div>
      {loading ? (
        <p className="mt-4" style={{ color: "var(--yellow)" }}>Ricerca segnale...</p>
      ) : (
        <div className="flex-1 overflow-hidden relative">
          {/* Contenitore nascosto per misurare le altezze - sempre presente ma invisibile */}
          <ul 
            ref={measurementRef}
            className="absolute pointer-events-none"
            style={{ 
              visibility: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: -1
            }}
          >
            {programsData.length > 0 &&
              programsData.map((program: any, index: number) => (
                <li 
                  key={`measure-${index}`}
                  className="p-2"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? "transparent" : "rgba(128, 128, 128, 0.2)"
                  }}
                >
                  <div className="flex gap-3">
                    <span className="w-[3rem]" style={{ color: "var(--green)" }}>
                      {index + 1 < 10 ? "30" : "3"}
                      {index + 1}
                    </span>
                    <div className="flex flex-col flex-1">
                      <div className="flex">
                        {(program.time || program.onair) && (
                          <p className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                            {(program.time || program.onair || "").split(' ')[1] || (program.time || program.onair || "")}
                          </p>
                        )}
                        {program.channel && (
                          <p className="truncate" style={{ color: "var(--cyan)" }}>
                            {program.channel}
                          </p>
                        )}
                      </div>
                      <p className="uppercase">
                        {program.title}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          {/* Lista visibile */}
          <ul ref={listRef} className="mt-4">
            {programsData.length > 0 &&
              programsData.slice(0, visibleCount).map((program: any, index: number) => (
                <li 
                  key={index}
                  className="p-2"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? "transparent" : "rgba(128, 128, 128, 0.2)"
                  }}
                >
                  <div className="flex gap-3">
                    <span className="w-[3rem]" style={{ color: "var(--green)" }}>
                      {index + 1 < 10 ? "30" : "3"}
                      {index + 1}
                    </span>
                    <div className="flex flex-col flex-1">
                      <div className="flex">
                        {(program.time || program.onair) && (
                          <p className="w-[3rem]" style={{ color: "var(--yellow)" }}>
                            {(program.time || program.onair || "").split(' ')[1] || (program.time || program.onair || "")}
                          </p>
                        )}
                        {program.channel && (
                          <p className="truncate" style={{ color: "var(--cyan)" }}>
                            {program.channel}
                          </p>
                        )}
                      </div>
                      <p className="uppercase">
                        {program.title}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
