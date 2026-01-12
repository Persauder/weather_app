import { type weatherData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.API_KEY;
const UNITS = 'metric';

export async function getWeatherByCity(city: string): Promise<weatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data: weatherData = await response.json();
    return data;
}
export async function getWeatherByCoords(lat: number, lon: number): Promise<weatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data: weatherData = await response.json();
    return data;
}