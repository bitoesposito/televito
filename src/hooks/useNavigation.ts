import { useMemo } from "react";
import { useNavigationContext, navigationConfig, getNavigationItemByPage } from "../store/navigation";

/**
 * Hook for navigation management
 * Provides navigation items, current page state, and navigation utilities
 */
export function useNavigation() {
	const { page, inputBuffer, handleInput, confirmPage, navigateToPage, renderedPage } = useNavigationContext();

	const currentNavigationItem = useMemo(() => {
		return getNavigationItemByPage(page);
	}, [page]);

	return {
		page,
		inputBuffer,
		handleInput,
		confirmPage,
		navigateToPage,
		renderedPage,
		navigationItems: navigationConfig,
		currentNavigationItem,
		getNavigationItemByPage,
	};
}
