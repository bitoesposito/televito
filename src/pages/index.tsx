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
    let debounceTimeout: ReturnType<typeof setTimeout>;
    let stabilizationTimeout: ReturnType<typeof setTimeout>;
    let lastAvailableHeight = 0;
    let isStabilizing = false;
    const HEIGHT_THRESHOLD = 15; // Soglia aumentata per evitare aggiornamenti inutili
    const STABILIZATION_DELAY = 500; // Tempo di attesa aumentato dopo un cambio di visibilità

    const checkWidgetVisibility = () => {
      // Non eseguire il check durante la stabilizzazione
      if (isStabilizing) {
        return;
      }

      if (!containerRef.current || !titleRef.current || !measurementRef.current) {
        return;
      }

      // Calcola l'altezza disponibile dal container principale (più stabile)
      // Non usare rightColumnRef perché cambia quando i widget vengono mostrati/nascosti
      let availableHeight = 0;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const titleRect = titleRef.current.getBoundingClientRect();
        const gap = 12;
        availableHeight = containerRect.height - titleRect.height - gap;
        
        // Su mobile, sottrai anche l'altezza della colonna sinistra se visibile
        if (leftColumnRef.current && window.innerWidth < 640) {
          const leftColumnRect = leftColumnRef.current.getBoundingClientRect();
          availableHeight -= leftColumnRect.height + gap;
        }
      }
      
      // Evita aggiornamenti se l'altezza non è cambiata significativamente (previene flickering)
      if (Math.abs(availableHeight - lastAvailableHeight) < HEIGHT_THRESHOLD && isInitializedRef.current) {
        return;
      }
      lastAvailableHeight = availableHeight;
      
      // Assicurati che l'altezza disponibile sia positiva
      if (availableHeight <= 0) {
        setVisibleWidgets({
          lastNews: false,
          tvGuide: false,
          economics: false,
          culture: false,
        });
        return;
      }
      
      const gap = 12; // gap tra gli elementi (gap-3 = 12px in Tailwind)

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
            setTimeout(checkWidgetVisibility, 100);
            return;
          }

          // Verifica che i widget abbiano contenuto caricato (non solo "RICERCA SEGNALE IN CORSO...")
          // Controlla se ci sono elementi <ul> con contenuto reale
          let allWidgetsLoaded = true;
          widgets.forEach((widget) => {
            const ulElements = widget.querySelectorAll('ul');
            if (ulElements.length > 0) {
              // Controlla se l'ul ha figli li (contenuto reale) o solo il messaggio di caricamento
              ulElements.forEach((ul) => {
                const listItems = ul.querySelectorAll('li');
                const loadingMessage = ul.textContent?.includes('RICERCA SEGNALE');
                // Se c'è solo il messaggio di caricamento e nessun item, il widget non è ancora pronto
                if (loadingMessage && listItems.length === 0) {
                  allWidgetsLoaded = false;
                }
              });
            }
          });

          // Se i widget non sono ancora completamente caricati, aspetta ancora
          if (!allWidgetsLoaded && !isInitializedRef.current) {
            setTimeout(checkWidgetVisibility, 200);
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
            
            // Attiva il lock di stabilizzazione per evitare re-calcoli immediati
            isStabilizing = true;
            clearTimeout(stabilizationTimeout);
            stabilizationTimeout = setTimeout(() => {
              isStabilizing = false;
            }, STABILIZATION_DELAY);
          }
        });
      });
    };

    // Debounced version per evitare troppi aggiornamenti
    const debouncedCheck = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        checkWidgetVisibility();
      }, 100);
    };

    // Initial check with a delay to allow DOM to render and widgets to load data
    // Aumentato a 300ms per dare tempo ai widget di caricare i dati
    const timeoutId = setTimeout(() => {
      checkWidgetVisibility();
    }, 300);

    // Use ResizeObserver to watch for size changes (debounced)
    // NON osservare rightColumnRef perché cambia quando i widget vengono mostrati/nascosti (causa loop)
    const resizeObserver = new ResizeObserver(() => {
      debouncedCheck();
    });

    // ResizeObserver specifico per i widget nel measurementRef
    // Questo rileva quando i widget cambiano dimensione dopo il caricamento dei dati
    const widgetResizeObserver = new ResizeObserver(() => {
      // Solo se non è ancora inizializzato o se è passato abbastanza tempo dalla stabilizzazione
      if (!isStabilizing) {
        debouncedCheck();
      }
    });

    // Funzione per osservare i widget nel measurementRef
    const observeWidgets = () => {
      if (measurementRef.current) {
        // Osserva il container dei widget
        widgetResizeObserver.observe(measurementRef.current);
        // Osserva anche i singoli widget dentro il measurementRef
        const widgets = Array.from(measurementRef.current.children) as HTMLElement[];
        widgets.forEach((widget) => {
          widgetResizeObserver.observe(widget);
        });
      }
    };

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }
    if (leftColumnRef.current) {
      resizeObserver.observe(leftColumnRef.current);
    }
    
    // Osserva i widget dopo un breve delay per assicurarsi che siano renderizzati
    const widgetObservationTimeout = setTimeout(() => {
      observeWidgets();
    }, 200);
    
    // NON osservare rightColumnRef per evitare loop

    // Also listen to window resize (debounced)
    window.addEventListener("resize", debouncedCheck);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(debounceTimeout);
      clearTimeout(stabilizationTimeout);
      clearTimeout(widgetObservationTimeout);
      resizeObserver.disconnect();
      widgetResizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCheck);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-3 h-full overflow-hidden" style={{ height: '100%' }}>
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
        <div ref={rightColumnRef} className="flex flex-col gap-3 overflow-hidden relative min-h-0">
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
