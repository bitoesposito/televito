import { useRef, useEffect, useState } from "react";
import type { HeaderProps } from "../../types/televideo";

const Header = function Header(
  { pageNumber, inputBuffer = "", onInputChange, onConfirm }: HeaderProps,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Enter",
  ];

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <header className="w-full flex justify-between gap-3 p-4">
      <div className="relative" onClick={() => inputRef.current?.focus()}>
        P{inputBuffer || pageNumber}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputBuffer}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm();
            else if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const numbersOnly = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 3);
            if (numbersOnly) onInputChange(numbersOnly);
          }}
          maxLength={3}
          autoComplete="off"
          className="absolute top-0 left-0 w-[2rem] ml-[.75rem] opacity-0 outline-none border-none text-transparent bg-transparent cursor-default"
          aria-label="Inserisci numero pagina"
        />
      </div>

      <div className="flex gap-4" style={{ color: 'var(--green)' }}>
        <div className="whitespace-nowrap" id="date">{formatDate(time)}</div>
        <div id="time" className="flex gap-1 whitespace-nowrap">
          <span className="inline-block w-[1.25rem]">{hours}</span>
          <span>:</span>
          <span className="inline-block w-[1.25rem]">{minutes}</span>
          <span>:</span>
          <span className="inline-block w-[1.25rem]">{seconds}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
