import { useMemo } from "react";
import { navigationConfig, getNavigationItemByPage } from "../lib/navigation.config";

/**
 * Hook for navigation management
 * Provides navigation items and utilities for page routing
 */
export function useNavigation(currentPage?: number) {
  const currentNavigationItem = useMemo(() => {
    return currentPage ? getNavigationItemByPage(currentPage) : undefined;
  }, [currentPage]);

  return {
    navigationItems: navigationConfig,
    currentNavigationItem,
    getNavigationItemByPage,
  };
}

