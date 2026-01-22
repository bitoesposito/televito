import { createContext, useContext, useReducer, useEffect, useRef, useCallback, createElement, type ReactNode } from "react";
import type { NavigationItem, NavigationState, NavigationAction, NavigationContextValue, NavigationProviderProps } from "../types/televideo";

import IndexPage from "../pages/index";
import NotFoundPage from "../pages/not-found";
import NotiziePage from "../pages/200";
import GuidaTvPage from "../pages/300";
import EconomiaPage from "../pages/400";
import CulturaPage from "../pages/500";

// Navigation Configuration
export const navigationConfig: NavigationItem[] = [
	{
		label: "100 indice",
		color: "blue",
		rss: null,
		targetPage: 100,
		link: "/",
		component: <IndexPage />,
	},
	{
		label: "200 notizie",
		color: "yellow",
		rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml",
		targetPage: 200,
		link: "/notizie",
		component: <NotiziePage />,
	},
	{
		label: "300 guida tv",
		color: "green",
		rss: "https://services.tivulaguida.it/api/epg/highlights.json",
		targetPage: 300,
		link: "/guida-tv",
		component: <GuidaTvPage />,
	},
	{
		label: "400 economia",
		color: "red",
		rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss130.xml",
		targetPage: 400,
		link: "/economia",
		component: <EconomiaPage />,
	},
	{
		label: "500 cultura",
		color: "cyan",
		rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss160.xml",
		targetPage: 500,
		link: "/cultura",
		component: <CulturaPage />,
	},
	{
		label: "not-found",
		color: "red",
		rss: null,
		targetPage: undefined,
		link: "/not-found",
		component: <NotFoundPage />,
	}
];

// Helper Functions
export function getNavigationItemByPage(page: number): NavigationItem | undefined {
	return navigationConfig.find((item) => item.targetPage === page);
}

export function getNavigationItemByLabel(label: string): NavigationItem | undefined {
	return navigationConfig.find((item) => item.label === label);
}

export function getAllPageNumbers(): number[] {
	return navigationConfig.map((item) => item.targetPage).filter((page): page is number => page !== undefined);
}

export function getPageComponent(page: number) {
	if (page >= 200 && page < 300) {
		return createElement(NotiziePage, { page });
	}

	if (page >= 300 && page < 400) {
		return createElement(GuidaTvPage, { page });
	}

	if (page >= 400 && page < 500) {
		return createElement(EconomiaPage, { page });
	}

	if (page >= 500 && page < 600) {
		return createElement(CulturaPage, { page });
	}

	const navigationItem = getNavigationItemByPage(page);
	if (navigationItem?.component) {
		return navigationItem.component;
	}
	return navigationConfig.find((item) => item.label === "not-found")?.component || <NotFoundPage />;
}

// State and Reducer
export function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
	switch (action.type) {
		case "SET_PAGE":
			return {
				...state,
				page: action.payload,
				inputBuffer: "",
			};
		case "SET_INPUT_BUFFER":
			return {
				...state,
				inputBuffer: action.payload,
			};
		case "NAVIGATE_TO_PAGE":
			return {
				page: action.payload,
				inputBuffer: "",
			};
		case "CLEAR_INPUT":
			return {
				...state,
				inputBuffer: "",
			};
		default:
			return state;
	}
}

// Context
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

const initialState: NavigationState = {
	page: 100,
	inputBuffer: "",
};

// Provider
export function NavigationProvider({ children }: NavigationProviderProps) {
	const [state, dispatch] = useReducer(navigationReducer, initialState);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const confirmPage = useCallback((val: string) => {
		if (val.length === 3) {
			dispatch({ type: "SET_PAGE", payload: Number(val) });
		}
	}, []);

	const handleInput = useCallback((val: string) => {
		const numbersOnly = val.replace(/\D/g, "").slice(0, 3);
		dispatch({ type: "SET_INPUT_BUFFER", payload: numbersOnly });
		clearTimeout(timeoutRef.current);

		if (numbersOnly.length === 3) {
			confirmPage(numbersOnly);
		} else if (numbersOnly.length > 0) {
			timeoutRef.current = setTimeout(() => confirmPage(numbersOnly), 2000);
		}
	}, [confirmPage]);

	const navigateToPage = useCallback((targetPage: number) => {
		dispatch({ type: "NAVIGATE_TO_PAGE", payload: targetPage });
		clearTimeout(timeoutRef.current);
	}, []);

	// Handle keyboard input for page navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			const isEditable = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
			const isModifier = e.ctrlKey || e.metaKey || e.altKey;

			if (isEditable || isModifier || !/[0-9]/.test(e.key)) return;

			e.preventDefault();
			const current = state.inputBuffer.length < 3 ? state.inputBuffer + e.key : e.key;
			handleInput(current);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [state.inputBuffer]);

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

	const renderedPage = getPageComponent(state.page);

	const confirmPageHandler = useCallback(() => {
		if (state.inputBuffer) {
			confirmPage(state.inputBuffer);
		}
	}, [state.inputBuffer, confirmPage]);

	const value: NavigationContextValue = {
		...state,
		handleInput,
		confirmPage: confirmPageHandler,
		navigateToPage,
		renderedPage,
	};

	return (
		<NavigationContext.Provider value={value}>
			{children}
		</NavigationContext.Provider>
	);
}

// Hook
export function useNavigationContext() {
	const context = useContext(NavigationContext);
	if (context === undefined) {
		throw new Error("useNavigationContext must be used within a NavigationProvider");
	}
	return context;
}
