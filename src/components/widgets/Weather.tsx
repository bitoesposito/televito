import { useEffect, useState } from "react";
import WeatherService from "../../services/weather.service";
import TitleBox from "../utility/TitleBox";
import type { WeatherResponse } from "../../types/televideo";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    WeatherService.getWeather().then(setWeather);
  }, []);

  return (
    <div className="p-2 border-1 border-gray-500 h-min">
      <TitleBox color="green" title="Meteo cerignola" size="md" className="mb-2"/>
      {weather && 
      <div className="flex gap-3 justify-between">
        <p className="uppercase">
          {WeatherService.getWeatherDescription(
            weather?.current_weather.weathercode ?? 0
          )}
        </p>
        <p style={{ color: "var(--cyan)" }}>
          {weather?.current_weather.temperature}°C
        </p>
      </div>}
      {weather === null && <p style={{ color: "var(--yellow)" }}>RICERCA SEGNALE IN CORSO...</p>}
    </div>
  );
}
