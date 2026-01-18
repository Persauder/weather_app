import { useState } from 'react';
import { type WeatherResponse } from '../types/weather';

export function useWeather() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [weather, _setWeather] = useState<WeatherResponse | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, _setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, _setError] = useState<string | null>(null);

    return {
        weather,
        loading,
        error,
    };
}
