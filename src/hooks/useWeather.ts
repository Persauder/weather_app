import { useState } from 'react';
import { type WeatherResponse } from '../types/weather';
import { getWeatherByCity } from '../services/weatherAPI';

export function useWeather() {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (city: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getWeatherByCity(city);
            setWeather(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        weather,
        loading,
        error,
        fetchWeather,
    };
}
