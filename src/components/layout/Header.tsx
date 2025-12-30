import { useRef, useEffect, useState, forwardRef } from "react";
import type { HeaderProps } from "../../types/televideo";

const Header = forwardRef<HTMLElement, HeaderProps>(
  function Header({ pageNumber, inputBuffer = "", onInputChange, onConfirm, className }, ref) {
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

    // Extract last digit for blinker positioning
    const displayValue = inputBuffer || pageNumber.toString();
    const lastDigit = displayValue.slice(-1);
    const beforeLastDigit = displayValue.slice(0, -1);
    const showBlinker = !inputBuffer; // Show blinker only when not typing

    const [isFocused, setIsFocused] = useState(false);

    return (
      <header ref={ref} className={`w-full flex justify-between items-baseline gap-3 p-4 ${className}`}>
        <div className="relative flex items-baseline gap-1">
          <span className="whitespace-nowrap">P.</span>
          <div 
            className="relative inline-flex items-baseline"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Box visibile tipo input - solo su mobile */}
            <div 
              className={`
                sm:hidden
                inline-flex items-baseline justify-start
                w-[3rem] px-2
                border-2 border-white
                transition-all
                ${isFocused ? 'border-yellow ring-2 ring-yellow' : 'hover:border-yellow'}
              `}
              style={{ 
                borderColor: isFocused ? 'var(--yellow)' : 'var(--white)',
                boxShadow: isFocused ? '0 0 0 1px var(--yellow)' : 'none'
              }}
            >
              <span className="whitespace-nowrap">
                {beforeLastDigit}
                <span>
                  {lastDigit}
                  {showBlinker && <span className="page-cursor" aria-hidden="true" />}
                </span>
              </span>
            </div>
            {/* Testo normale su desktop */}
            <span className="hidden sm:inline whitespace-nowrap">
              {beforeLastDigit}
              <span>
                {lastDigit}
                {showBlinker && <span className="page-cursor" aria-hidden="true" />}
              </span>
            </span>
            {/* Input invisibile per la gestione dell'input */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputBuffer}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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
              className="absolute inset-0 opacity-0 outline-none border-none text-transparent bg-transparent cursor-text"
              aria-label="Inserisci numero pagina"
            />
          </div>
          <span className="text-white opacity-50 sm:hidden truncate">
             Clicca per navigare
          </span>
        </div>

        <div className="flex items-baseline gap-2" style={{ color: 'var(--green)' }}>
          <div className="whitespace-nowrap" id="date">{formatDate(time)}</div>
          <div id="time" className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="inline-block w-[1rem]">{hours}</span>
            <span>:</span>
            <span className="inline-block w-[1rem]">{minutes}</span>
            <span>:</span>
            <span className="inline-block w-[1rem]">{seconds}</span>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export default Header;
