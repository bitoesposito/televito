import type { ReactElement, ReactNode } from "react";

// Utility types
export type TelevideoColor = "blue" | "green" | "yellow" | "red" | "white" | "cyan";
export type TelevideoSize = "sm" | "md" | "lg";

// Component props
export interface TitleBoxProps {
  color: TelevideoColor;
  size?: TelevideoSize;
  title: string;
  centerText?: boolean;
  className?: string;
  onClick?: () => void;
}

// Layout
export interface HeaderProps {
  pageNumber: number;
  inputBuffer?: string;
  onInputChange: (value: string) => void;
  onConfirm: () => void;
  className?: string;
}

export interface NavigationItem {
  label: string;
  color: TelevideoColor;
  rss: string | null;
  targetPage: number | undefined;
  link: string;
  component: ReactElement;
}

export interface NavigationProps {
  onNavigate?: (page: number) => void;
}

// Navigation state
export interface NavigationState {
  page: number;
  inputBuffer: string;
}

export type NavigationAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_INPUT_BUFFER"; payload: string }
  | { type: "NAVIGATE_TO_PAGE"; payload: number }
  | { type: "CLEAR_INPUT" };

export interface NavigationContextValue extends NavigationState {
  handleInput: (value: string) => void;
  confirmPage: () => void;
  navigateToPage: (targetPage: number) => void;
  renderedPage: ReactNode;
}

export interface NavigationProviderProps {
  children: ReactNode;
}

// Hooks
export interface UseVisibleWidgetsOptions {
  widgetCount: number;
  gap?: number; // Gap between widgets in pixels
  containerRef?: React.RefObject<Element | null>;
}

// Cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// RSS
export interface RssData {
  status: string;
  items?: any[];
  feed?: any;
}

// Weather
export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature: string;
  is_day: string;
  weathercode: string;
  winddirection: string;
  windspeed: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  is_day: number;
  weathercode: number;
  winddirection: number;
  windspeed: number;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: CurrentWeatherUnits;
  current_weather: CurrentWeather;
}