import { useState } from 'react';
import { type WeatherResponse } from '../types/weather';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherAPI';

export function useWeather() {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (city: string): Promise<WeatherResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await getWeatherByCity(city);
            setWeather(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setWeather(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await getWeatherByCoords(lat, lon);
            setWeather(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setWeather(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        weather,
        loading,
        error,
        fetchWeather,
        fetchWeatherByCoords,
        clearError,
    };
}
