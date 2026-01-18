import { type WeatherResponse } from '../types/weather';
import { getWeatherIcon } from '../services/weatherAPI';

interface WeatherDetailsProps {
    weather: WeatherResponse;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
    const { name, main, weather: weatherInfo, wind, sys, visibility } = weather;
    const iconUrl = getWeatherIcon(weatherInfo[0].icon);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {name}, {sys.country}
                    </h2>
                    <p className="text-gray-500 capitalize">{weatherInfo[0].description}</p>
                </div>
                <img src={iconUrl} alt={weatherInfo[0].description} className="w-20 h-20" />
            </div>

            <div className="text-5xl font-bold text-gray-800 mb-6">
                {Math.round(main.temp)}°C
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Feels like</p>
                    <p className="text-lg font-semibold">{Math.round(main.feels_like)}°C</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Humidity</p>
                    <p className="text-lg font-semibold">{main.humidity}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Wind</p>
                    <p className="text-lg font-semibold">{wind.speed} m/s</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Pressure</p>
                    <p className="text-lg font-semibold">{main.pressure} hPa</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Visibility</p>
                    <p className="text-lg font-semibold">{(visibility / 1000).toFixed(1)} km</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Min / Max</p>
                    <p className="text-lg font-semibold">
                        {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
                    </p>
                </div>
            </div>
        </div>
    );
}

