import { type WeatherResponse } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const UNITS = 'metric';

function handleApiError(response: Response): never {
    switch (response.status) {
        case 404:
            throw new Error('City not found. Please check the city name.');
        case 401:
            throw new Error('Invalid API key. Please check your settings.');
        case 429:
            throw new Error('Request limit exceeded. Please try again later.');
        default:
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
}

export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleApiError(response);
    }

    const data: WeatherResponse = await response.json();
    return data;
}
export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleApiError(response);
    }

    const data: WeatherResponse = await response.json();
    return data;
}

export function getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export interface ForecastResponse {
    list: WeatherResponse[];
    city: {
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
    };
}

export async function getForecastByCoords(lat: number, lon: number): Promise<ForecastResponse> {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleApiError(response);
    }

    const data: ForecastResponse = await response.json();
    return data;
}

