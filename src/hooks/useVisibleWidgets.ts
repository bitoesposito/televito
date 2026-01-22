import { useState, useEffect, useRef } from "react";
import type { UseVisibleWidgetsOptions } from "../types/televideo";

/**
 * Hook that calculates how many widgets can be displayed completely
 * in the available vertical space, hiding those that don't fit.
 * Automatically considers header and navigation bar.
 */
export function useVisibleWidgets({
	widgetCount,
	gap = 12,
	containerRef,
}: UseVisibleWidgetsOptions) {
	// Initialize with all false to avoid initial flash
	const [visibleWidgets, setVisibleWidgets] = useState<boolean[]>(
		Array(widgetCount).fill(false)
	);
	const [isInitialized, setIsInitialized] = useState(false);
	const measurementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!measurementRef.current) return;

		const checkVisibility = () => {
			if (!measurementRef.current) return;

			// Find visible navigation in DOM (can be both mobile and desktop)
			const navs = document.querySelectorAll("nav");
			// Find the visible nav (the one that doesn't have display: none)
			let visibleNav: HTMLElement | null = null;
			navs.forEach((nav) => {
				const navElement = nav as HTMLElement;
				const style = window.getComputedStyle(navElement);
				if (style.display !== "none" && !visibleNav) {
					visibleNav = navElement;
				}
			});

			// Calculate available height
			let availableHeight = 0;

			if (containerRef?.current) {
				// Use containerRef to calculate available height
				const containerElement = containerRef.current as HTMLElement;
				const containerRect = containerElement.getBoundingClientRect();
				const containerTop = containerRect.top;
				const containerBottom = visibleNav
					? (visibleNav as HTMLElement).getBoundingClientRect().top
					: window.innerHeight;
				availableHeight = containerBottom - containerTop;
			} else {
				// Fallback: use viewport minus header and navigation
				const viewportHeight = window.innerHeight;
				const header = document.querySelector("header") as HTMLElement | null;
				let usedHeight = 0;

				if (header) {
					usedHeight += header.offsetHeight;
				}

				if (visibleNav) {
					usedHeight += (visibleNav as HTMLElement).offsetHeight;
				}

				availableHeight = viewportHeight - usedHeight;
			}

			// If we don't have available height, hide everything
			if (availableHeight <= 0) {
				setVisibleWidgets(Array(widgetCount).fill(false));
				setIsInitialized(true);
				return;
			}

			// Measure widget heights
			const widgetHeights: number[] = [];
			// measurementRef contains a div wrapper, so we take its children
			const measurementContainer = measurementRef.current;
			const wrapper = measurementContainer.firstElementChild as HTMLElement;
			const widgets = wrapper ? Array.from(wrapper.children) as HTMLElement[] : [];

			widgets.forEach((widget) => {
				const height = widget.offsetHeight;
				if (height > 0) {
					widgetHeights.push(height);
				}
			});

			// If we don't have all heights, wait but with a maximum timeout
			if (widgetHeights.length < widgetCount) {
				// Use requestAnimationFrame to wait for rendering
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setTimeout(checkVisibility, 50);
					});
				});
				return;
			}

			// If we don't have valid heights after several attempts, show at least the first widget as fallback
			if (widgetHeights.length === 0 || widgetHeights.every(h => h === 0)) {
				// Wait a bit more if it's the first time
				if (!isInitialized) {
					setTimeout(checkVisibility, 200);
					return;
				}
				// After several attempts, show at least the first widget
				const fallback = Array(widgetCount).fill(false);
				fallback[0] = true; // Show at least the first
				setVisibleWidgets(fallback);
				setIsInitialized(true);
				return;
			}

			// Calculate how many widgets can fit completely
			const newVisibility: boolean[] = [];
			let accumulatedHeight = 0;

			for (let i = 0; i < widgetHeights.length; i++) {
				const widgetHeight = widgetHeights[i];
				const totalHeight = accumulatedHeight + widgetHeight + (i > 0 ? gap : 0);

				if (totalHeight <= availableHeight) {
					newVisibility.push(true);
					accumulatedHeight = totalHeight;
				} else {
					// No more space, hide this and all subsequent ones
					for (let j = i; j < widgetCount; j++) {
						newVisibility.push(false);
					}
					break;
				}
			}

			// Make sure we always have widgetCount elements
			while (newVisibility.length < widgetCount) {
				newVisibility.push(false);
			}

			setVisibleWidgets(newVisibility);
			setIsInitialized(true);
		};

		// Debounce to avoid too many calculations
		let debounceTimeout: ReturnType<typeof setTimeout>;
		const debouncedCheck = () => {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(checkVisibility, 50);
		};

		// Initial check with double requestAnimationFrame to ensure DOM is rendered
		// Increase delay to give widgets time to load data
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setTimeout(checkVisibility, 300);
			});
		});

		// ResizeObserver to react to changes
		const resizeObserver = new ResizeObserver(() => {
			debouncedCheck();
		});

		// Observe measurement container
		if (measurementRef.current) {
			resizeObserver.observe(measurementRef.current);
		}

		// Observe individual widgets
		if (measurementRef.current) {
			const wrapper = measurementRef.current.firstElementChild as HTMLElement;
			if (wrapper) {
				const widgets = Array.from(wrapper.children) as HTMLElement[];
				widgets.forEach((widget) => {
					resizeObserver.observe(widget);
				});
			}
		}

		// Observe header and navigation if present
		const header = document.querySelector("header");
		const navs = document.querySelectorAll("nav");
		if (header) {
			resizeObserver.observe(header);
		}
		// Observe all navs (mobile and desktop)
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
