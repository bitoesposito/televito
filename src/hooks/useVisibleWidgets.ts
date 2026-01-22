import { useState, useEffect, useRef } from "react";

interface UseVisibleWidgetsOptions {
	widgetCount: number;
	gap?: number; // Gap tra i widget in pixel
	containerRef?: React.RefObject<Element | null>;
}

/**
 * Hook che calcola quanti widget possono essere mostrati completamente
 * nello spazio verticale disponibile, nascondendo quelli che non entrano.
 * Considera automaticamente header e navigation bar.
 */
export function useVisibleWidgets({
	widgetCount,
	gap = 12,
	containerRef,
}: UseVisibleWidgetsOptions) {
	// Inizializza con tutti false per evitare flash iniziale
	const [visibleWidgets, setVisibleWidgets] = useState<boolean[]>(
		Array(widgetCount).fill(false)
	);
	const [isInitialized, setIsInitialized] = useState(false);
	const measurementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!measurementRef.current) return;

		const checkVisibility = () => {
			if (!measurementRef.current) return;

			// Trova navigation visibile nel DOM (può esserci sia mobile che desktop)
			const navs = document.querySelectorAll("nav");
			// Trova la nav visibile (quella che non ha display: none)
			let visibleNav: HTMLElement | null = null;
			navs.forEach((nav) => {
				const navElement = nav as HTMLElement;
				const style = window.getComputedStyle(navElement);
				if (style.display !== "none" && !visibleNav) {
					visibleNav = navElement;
				}
			});

			// Calcola l'altezza disponibile
			let availableHeight = 0;

			if (containerRef?.current) {
				// Usa il containerRef per calcolare l'altezza disponibile
				const containerRect = containerRef.current.getBoundingClientRect();
				const containerTop = containerRect.top;
				const containerBottom = visibleNav
					? visibleNav.getBoundingClientRect().top
					: window.innerHeight;
				availableHeight = containerBottom - containerTop;
			} else {
				// Fallback: usa viewport meno header e navigation
				const viewportHeight = window.innerHeight;
				const header = document.querySelector("header");
				let usedHeight = 0;

				if (header) {
					usedHeight += header.offsetHeight;
				}

				if (visibleNav) {
					usedHeight += visibleNav.offsetHeight;
				}

				availableHeight = viewportHeight - usedHeight;
			}

			// Se non abbiamo altezza disponibile, nascondi tutto
			if (availableHeight <= 0) {
				setVisibleWidgets(Array(widgetCount).fill(false));
				setIsInitialized(true);
				return;
			}

			// Misura le altezze dei widget
			const widgetHeights: number[] = [];
			// Il measurementRef contiene un div wrapper, quindi prendiamo i suoi figli
			const measurementContainer = measurementRef.current;
			const wrapper = measurementContainer.firstElementChild as HTMLElement;
			const widgets = wrapper ? Array.from(wrapper.children) as HTMLElement[] : [];

			widgets.forEach((widget) => {
				const height = widget.offsetHeight;
				if (height > 0) {
					widgetHeights.push(height);
				}
			});

			// Se non abbiamo tutte le altezze, aspetta ma con un timeout massimo
			if (widgetHeights.length < widgetCount) {
				// Usa requestAnimationFrame per aspettare il rendering
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setTimeout(checkVisibility, 50);
					});
				});
				return;
			}

			// Se non abbiamo altezze valide dopo diversi tentativi, mostra almeno il primo widget come fallback
			if (widgetHeights.length === 0 || widgetHeights.every(h => h === 0)) {
				// Aspetta ancora un po' se è la prima volta
				if (!isInitialized) {
					setTimeout(checkVisibility, 200);
					return;
				}
				// Dopo diversi tentativi, mostra almeno il primo widget
				const fallback = Array(widgetCount).fill(false);
				fallback[0] = true; // Mostra almeno il primo
				setVisibleWidgets(fallback);
				setIsInitialized(true);
				return;
			}

			// Calcola quanti widget possono entrare completamente
			const newVisibility: boolean[] = [];
			let accumulatedHeight = 0;

			for (let i = 0; i < widgetHeights.length; i++) {
				const widgetHeight = widgetHeights[i];
				const totalHeight = accumulatedHeight + widgetHeight + (i > 0 ? gap : 0);

				if (totalHeight <= availableHeight) {
					newVisibility.push(true);
					accumulatedHeight = totalHeight;
				} else {
					// Non c'è più spazio, nascondi questo e tutti i successivi
					for (let j = i; j < widgetCount; j++) {
						newVisibility.push(false);
					}
					break;
				}
			}

			// Assicurati di avere sempre widgetCount elementi
			while (newVisibility.length < widgetCount) {
				newVisibility.push(false);
			}

			setVisibleWidgets(newVisibility);
			setIsInitialized(true);
		};

		// Debounce per evitare troppi calcoli
		let debounceTimeout: ReturnType<typeof setTimeout>;
		const debouncedCheck = () => {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(checkVisibility, 50);
		};

		// Initial check con doppio requestAnimationFrame per assicurarsi che il DOM sia renderizzato
		// Aumentiamo il delay per dare tempo ai widget di caricare i dati
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setTimeout(checkVisibility, 300);
			});
		});

		// ResizeObserver per reagire ai cambiamenti
		const resizeObserver = new ResizeObserver(() => {
			debouncedCheck();
		});

		// Osserva il container di misurazione
		if (measurementRef.current) {
			resizeObserver.observe(measurementRef.current);
		}

		// Osserva i singoli widget
		if (measurementRef.current) {
			const wrapper = measurementRef.current.firstElementChild as HTMLElement;
			if (wrapper) {
				const widgets = Array.from(wrapper.children) as HTMLElement[];
				widgets.forEach((widget) => {
					resizeObserver.observe(widget);
				});
			}
		}

		// Osserva header e navigation se presenti
		const header = document.querySelector("header");
		const navs = document.querySelectorAll("nav");
		if (header) {
			resizeObserver.observe(header);
		}
		// Osserva tutte le nav (mobile e desktop)
		navs.forEach((nav) => {
			resizeObserver.observe(nav);
		});

		// Listen to window resize
		window.addEventListener("resize", debouncedCheck);

		return () => {
			clearTimeout(debounceTimeout);
			resizeObserver.disconnect();
			window.removeEventListener("resize", debouncedCheck);
		};
	}, [widgetCount, gap, containerRef]);

	return {
		visibleWidgets,
		measurementRef,
		isInitialized,
	};
}
