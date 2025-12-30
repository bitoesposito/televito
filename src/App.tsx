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
    const updateHeights = () => {
      if (headerRef.current && navRef.current) {
        const headerH = headerRef.current.offsetHeight;
        const navH = navRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const available = viewportHeight - headerH - navH;
        
        setAvailableHeight(available);
      }
    };

    // Initial measurement
    updateHeights();

    // Create ResizeObserver to watch for height changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener("resize", updateHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeights);
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
    <main className="flex flex-col min-h-screen h-screen max-w-screen-lg mx-auto">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          ref={headerRef}
          pageNumber={page}
          inputBuffer={inputBuffer}
          onInputChange={handleInput}
          onConfirm={confirmPage}
        />
        <div 
          className="mx-4 overflow-hidden"
          style={{ 
            height: `${availableHeight}px`
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
