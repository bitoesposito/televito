import type { WeatherResponse } from "../types/televideo";
import CacheService from "./cache.service";

export default class WeatherService {
    private static readonly API_URL = "https://api.open-meteo.com/v1/forecast";
    // Coordinate di Cerignola, Puglia
    private static readonly LATITUDE = 41.2667;
    private static readonly LONGITUDE = 15.9000;

    public static async getWeather(): Promise<WeatherResponse> {
        const cacheKey = `weather:${WeatherService.LATITUDE}:${WeatherService.LONGITUDE}`;
        
        return CacheService.get(cacheKey, async () => {
            const response = await fetch(
                `${WeatherService.API_URL}?latitude=${WeatherService.LATITUDE}&longitude=${WeatherService.LONGITUDE}&current_weather=true`
            );  
            
            if (!response.ok) {
                throw new Error(`Failed to fetch weather: ${response.statusText}`);
            }
            
            return await response.json() as WeatherResponse;
        });
    }

    public static getWeatherDescription(wCode: number): string {
        if (wCode === 0) return "SERENO";
        if (wCode === 1 || wCode === 2 || wCode === 3) return "NUVOLOSO";
        if (wCode >= 45 && wCode <= 48) return "NEBBIA";
        if (wCode >= 51 && wCode <= 67) return "PIOGGIA";
        if (wCode >= 71) return "NEVE";
        return "VARIABILE";
    }   
}