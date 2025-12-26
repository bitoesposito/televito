import type { ReactElement } from "react";

// utility
export type TelevideoColor = "blue" | "green" | "yellow" | "red" | "white" | "cyan";
export type TelevideoSize = "md" | "lg";

// components 
export interface TitleBoxProps {
  color: TelevideoColor;
  size?: TelevideoSize;
  title: string;
  centerText?: boolean;
  className?: string;
  onClick?: () => void;
}

// layout
export interface HeaderProps {
  pageNumber: number;
  inputBuffer?: string;
  onInputChange: (value: string) => void;
  onConfirm: () => void;
}

export interface NavigationItem {
  label: string;
  color: TelevideoColor;
  rss: string | null;
  targetPage: number | undefined;
  link: string;
  component: ReactElement;
}

// weather
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