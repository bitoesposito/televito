import { useEffect, useState } from "react";

export default function Loader({ time, blocks, targetPage = 100 }: { time: number, blocks: number, targetPage?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = time * 500;
    const interval = 250;
    const steps = duration / interval;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          // Dispatch custom event to trigger navigation to target page
          window.dispatchEvent(
            new CustomEvent("navigateToPage", { detail: targetPage })
          );
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [targetPage]);

  const totalBlocks = blocks;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex justify-between items-center">
        <span className="uppercase" style={{ color: "var(--cyan)" }}>
          risintonizzazione in corso...
        </span>
        <span style={{ color: "var(--cyan)" }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="flex gap-1 items-center">
        {Array.from({ length: totalBlocks }).map((_, index) => (
          <div
            key={index}
            className="flex-1"
            style={{
              height: ".75rem",
              backgroundColor:
                index < filledBlocks ? "var(--cyan)" : "var(--black)",
              border: "1px solid var(--white)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
