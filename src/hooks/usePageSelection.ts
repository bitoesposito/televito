import { useState, useRef, useEffect } from "react";

export function usePageSelection(initialPage: number = 100) {
  const [page, setPage] = useState<number>(initialPage);
  const [inputBuffer, setInputBuffer] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  function parsePageNumber(value: string): number {
    return Number(value);
  }

  function canConfirmPage(value: string): boolean {
    return value.length === 3;
  }

  function sanitizePageInput(input: string): string {
    return input.replace(/\D/g, "").slice(0, 3);
  }

  const confirmPage = (val: string) => {
    if (canConfirmPage(val)) {
      setPage(parsePageNumber(val));
      setInputBuffer("");
    }
  };

  const handleInput = (val: string) => {
    const numbersOnly = sanitizePageInput(val);
    setInputBuffer(numbersOnly);
    clearTimeout(timeoutRef.current);

    if (canConfirmPage(numbersOnly)) {
      confirmPage(numbersOnly);
    } else if (numbersOnly.length > 0) {
      timeoutRef.current = setTimeout(() => confirmPage(numbersOnly), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditable = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      const isModifier = e.ctrlKey || e.metaKey || e.altKey;

      if (isEditable || isModifier || !/[0-9]/.test(e.key)) return;

      e.preventDefault();
      inputRef.current?.focus();
      const current = inputBuffer.length < 3 ? inputBuffer + e.key : e.key;
      handleInput(current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputBuffer]);

  const navigateToPage = (targetPage: number) => {
    setPage(targetPage);
    setInputBuffer("");
    clearTimeout(timeoutRef.current);
  };

  return {
    page,
    inputBuffer,
    inputRef,
    handleInput,
    confirmPage: () => inputBuffer && confirmPage(inputBuffer),
    navigateToPage,
  };
}