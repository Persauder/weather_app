import { type weatherData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.API_KEY;
const UNITS = 'metric';

function handleApiError(response: Response): never {
    switch (response.status) {
        case 404:
            throw new Error('Місто не знайдено. Перевірте правильність назви міста.');
        case 401:
            throw new Error('Невалідний API ключ. Перевірте налаштування.');
        case 429:
            throw new Error('Перевищено ліміт запитів. Спробуйте пізніше.');
        default:
            throw new Error(`Помилка отримання даних про погоду: ${response.statusText}`);
    }
}

export async function getWeatherByCity(city: string): Promise<weatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleApiError(response);
    }

    const data: weatherData = await response.json();
    return data;
}
export async function getWeatherByCoords(lat: number, lon: number): Promise<weatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;

    const response = await fetch(url);

    if (!response.ok) {
        handleApiError(response);
    }

    const data: weatherData = await response.json();
    return data;
}

export function getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
