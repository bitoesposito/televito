import "./main.css";
import Header from "./components/layout/Header";
import { usePageSelection } from "./hooks/usePageSelection";
import { useState, useEffect, useRef } from "react";
import Navigation from "./components/layout/Navigation";
import { getPageComponent } from "./lib/navigation.config";

function App() {
  const { page, inputBuffer, handleInput, confirmPage, navigateToPage } =
    usePageSelection(100);

  const [renderedPage, setRenderedPage] = useState(getPageComponent(100));
  const [availableHeight, setAvailableHeight] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setRenderedPage(getPageComponent(page));
  }, [page]);

  // Measure header and navigation heights and calculate available height
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let lastHeight = 0;
    const THRESHOLD = 2; // Soglia in pixel per evitare aggiornamenti inutili

    const updateHeights = () => {
      if (headerRef.current && navRef.current) {
        const headerH = headerRef.current.offsetHeight;
        const navH = navRef.current.offsetHeight;
        // Usa visualViewport se disponibile (più accurato su mobile), altrimenti window.innerHeight
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const available = Math.max(0, viewportHeight - headerH - navH);
        
        // Aggiorna solo se la differenza è significativa (evita flickering)
        if (Math.abs(available - lastHeight) > THRESHOLD) {
          lastHeight = available;
          setAvailableHeight(available);
        }
      }
    };

    // Debounced version per evitare troppi aggiornamenti
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeights, 50);
    };

    // Initial measurement
    updateHeights();

    // Create ResizeObserver to watch for height changes
    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdate();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    // Also listen to window resize as fallback (debounced)
    window.addEventListener("resize", debouncedUpdate);
    
    // Su mobile, ascolta anche i cambiamenti del visualViewport (per gestire la barra degli indirizzi)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", debouncedUpdate);
      window.visualViewport.addEventListener("scroll", debouncedUpdate);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", debouncedUpdate);
        window.visualViewport.removeEventListener("scroll", debouncedUpdate);
      }
    };
  }, []);

  // Listen for navigation events from components (e.g., NotFoundPage auto-redirect)
  useEffect(() => {
    const handleNavigate = (event: CustomEvent<number>) => {
      navigateToPage(event.detail);
    };

    window.addEventListener("navigateToPage", handleNavigate as EventListener);
    return () => {
      window.removeEventListener("navigateToPage", handleNavigate as EventListener);
    };
  }, [navigateToPage]);

  return (
    <main 
      className="flex flex-col max-w-screen-lg mx-auto overflow-hidden"
      style={{ 
        height: '100dvh',
        maxHeight: '100dvh'
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <Header
          ref={headerRef}
          pageNumber={page}
          inputBuffer={inputBuffer}
          onInputChange={handleInput}
          onConfirm={confirmPage}
        />
        <div 
          className="mx-4 overflow-hidden flex-1 min-h-0"
          style={{ 
            height: availableHeight > 0 ? `${availableHeight}px` : '100%',
            maxHeight: availableHeight > 0 ? `${availableHeight}px` : '100%',
            overflowY: 'hidden',
            position: 'relative'
          }}
        >
          {renderedPage}
        </div>
      </div>
      <Navigation ref={navRef} onNavigate={navigateToPage} />
    </main>
  );
}

export default App;
