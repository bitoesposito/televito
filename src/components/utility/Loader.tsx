import { useEffect, useState } from "react";

export default function Loader({ time, blocks }: { time: number, blocks: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Dispatch event after 10 seconds to navigate to page 100
    const duration = time * 1000; // 10 seconds
    const interval = 500; // Update every 1 second (1 block per second)
    const steps = duration / interval; // 10 steps
    const increment = 100 / steps; // 10% per step

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          // Dispatch custom event to trigger navigation
          window.dispatchEvent(
            new CustomEvent("navigateToPage", { detail: 100 })
          );
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, []);

  const totalBlocks = blocks;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <>
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
    </>
  );
}
