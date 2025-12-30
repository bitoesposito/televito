import { useEffect, useState, useRef } from "react";
import LastNewsWidget from "../components/widgets/LatestNews";
import TitleBox from "../components/utility/TitleBox";
import WeatherWidget from "../components/widgets/Weather";
import ContactWidget from "../components/widgets/Contact";
import TvGuideWidget from "../components/widgets/TvGuideWidget";
import EconomicsNewsWidget from "../components/widgets/EconomicsNews";
import CultureNewsWidget from "../components/widgets/CultureNews";

export default function IndexPage() {
  // Inizializza con valori conservativi per evitare flicker
  const [visibleWidgets, setVisibleWidgets] = useState({
    lastNews: true,
    tvGuide: false,
    economics: false,
    culture: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const widgetHeightsRef = useRef<number[]>([]);
  const isInitializedRef = useRef(false);
  const currentVisibilityRef = useRef({
    lastNews: true,
    tvGuide: false,
    economics: false,
    culture: false,
  });

  useEffect(() => {
    const checkWidgetVisibility = () => {
      if (!containerRef.current || !titleRef.current || !measurementRef.current) {
        return;
      }

      const containerHeight = containerRef.current.offsetHeight;
      const titleHeight = titleRef.current.offsetHeight;
      const gap = 8; // gap tra gli elementi (gap-3 = 8px)
      const availableHeight = containerHeight - titleHeight - gap;

      // Usa doppio requestAnimationFrame per assicurarsi che il DOM sia completamente renderizzato
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!measurementRef.current) return;

          const measurementContainer = measurementRef.current;
          const widgets = Array.from(measurementContainer.children) as HTMLElement[];
          
          // Misura l'altezza di ogni widget quando sono tutti renderizzati (ma invisibili)
          const widgetHeights: number[] = [];
          widgets.forEach((widget) => {
            const height = widget.offsetHeight;
            if (height > 0) {
              widgetHeights.push(height);
            }
          });

          // Se non abbiamo tutte le altezze, aspetta ancora
          if (widgetHeights.length < 4) {
            setTimeout(checkWidgetVisibility, 50);
            return;
          }

          // Memorizza le altezze se sono cambiate
          const heightsChanged = widgetHeightsRef.current.length !== widgetHeights.length ||
            widgetHeightsRef.current.some((h, i) => h !== widgetHeights[i]);
          
          if (heightsChanged) {
            widgetHeightsRef.current = widgetHeights;
          }

          // Calcola quanti widget possono entrare nello spazio disponibile
          let accumulatedHeight = 0;
          const newVisibility = {
            lastNews: false,
            tvGuide: false,
            economics: false,
            culture: false,
          };

          // Prova ad aggiungere i widget uno per uno
          if (widgetHeights[0] && accumulatedHeight + widgetHeights[0] <= availableHeight) {
            accumulatedHeight += widgetHeights[0];
            newVisibility.lastNews = true;
          }

          if (widgetHeights[1] && accumulatedHeight + gap + widgetHeights[1] <= availableHeight) {
            accumulatedHeight += gap + widgetHeights[1];
            newVisibility.tvGuide = true;
          }

          if (widgetHeights[2] && accumulatedHeight + gap + widgetHeights[2] <= availableHeight) {
            accumulatedHeight += gap + widgetHeights[2];
            newVisibility.economics = true;
          }

          if (widgetHeights[3] && accumulatedHeight + gap + widgetHeights[3] <= availableHeight) {
            accumulatedHeight += gap + widgetHeights[3];
            newVisibility.culture = true;
          }

          // Aggiorna solo se è cambiato qualcosa o se è la prima inizializzazione
          const visibilityChanged = 
            !isInitializedRef.current ||
            newVisibility.lastNews !== currentVisibilityRef.current.lastNews ||
            newVisibility.tvGuide !== currentVisibilityRef.current.tvGuide ||
            newVisibility.economics !== currentVisibilityRef.current.economics ||
            newVisibility.culture !== currentVisibilityRef.current.culture;

          if (visibilityChanged) {
            currentVisibilityRef.current = newVisibility;
            setVisibleWidgets(newVisibility);
            isInitializedRef.current = true;
          }
        });
      });
    };

    // Initial check with a small delay to allow DOM to render
    const timeoutId = setTimeout(() => {
      checkWidgetVisibility();
    }, 100);

    // Use ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      checkWidgetVisibility();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }
    if (leftColumnRef.current) {
      resizeObserver.observe(leftColumnRef.current);
    }
    if (rightColumnRef.current) {
      resizeObserver.observe(rightColumnRef.current);
    }

    // Also listen to window resize
    window.addEventListener("resize", checkWidgetVisibility);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkWidgetVisibility);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-3 h-full overflow-hidden">
      <div ref={titleRef} className="flex-shrink-0">
        <TitleBox color="blue" title="Benvenuti al televito" size="lg" />
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 flex-1 min-h-0 overflow-hidden">
        <div ref={leftColumnRef} className="flex flex-col gap-3 sm:h-full sm:justify-between sm:overflow-hidden">
          <ContactWidget />
          <div className="flex flex-col gap-3">
            <WeatherWidget />
          </div>
        </div>
        <div ref={rightColumnRef} className="flex flex-col gap-3 overflow-hidden relative">
          {/* Contenitore nascosto per misurare le altezze - sempre presente ma invisibile */}
          <div 
            ref={measurementRef}
            className="absolute inset-0 pointer-events-none"
            style={{ 
              visibility: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: -1
            }}
          >
            <LastNewsWidget />
            <TvGuideWidget />
            <EconomicsNewsWidget />
            <CultureNewsWidget />
          </div>
          {/* Widget visibili */}
          <div className="flex flex-col gap-3">
            {visibleWidgets.lastNews && <LastNewsWidget />}
            {visibleWidgets.tvGuide && <TvGuideWidget />}
            {visibleWidgets.economics && <EconomicsNewsWidget />}
            {visibleWidgets.culture && <CultureNewsWidget />}
          </div>
        </div>
      </div>
    </div>
  );
}
