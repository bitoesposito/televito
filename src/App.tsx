import "./main.css";
import Header from "./components/layout/Header";
import { usePageSelection } from "./hooks/usePageSelection";
import { useState, useEffect } from "react";
import Navigation from "./components/layout/Navigation";
import { getPageComponent } from "./lib/navigation.config";

function App() {
  const { page, inputBuffer, handleInput, confirmPage, navigateToPage } =
    usePageSelection(100);

  const [renderedPage, setRenderedPage] = useState(getPageComponent(100));

  useEffect(() => {
    setRenderedPage(getPageComponent(page));
  }, [page]);

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
    <main className="flex flex-col min-h-screen h-screen">
      <div className="flex-1">
        <Header
          pageNumber={page}
          inputBuffer={inputBuffer}
          onInputChange={handleInput}
          onConfirm={confirmPage}
        />
        <div className="mx-4">
          {renderedPage}
        </div>
      </div>

      <Navigation onNavigate={navigateToPage} />
    </main>
  );
}

export default App;
