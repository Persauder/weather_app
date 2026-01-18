import { type WeatherResponse } from '../types/weather';
import { getWeatherIcon } from '../services/weatherAPI';

interface WeatherPopupProps {
  data: WeatherResponse;
  onClose?: () => void;
}

export function WeatherPopup({ data, onClose }: WeatherPopupProps) {
  if (!data) return null;

  const { name, dt, weather, main, wind } = data;
  const weatherInfo = weather?.[0];

  // Format date and time
  const date = new Date(dt * 1000);
  const formattedDateTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const iconUrl = weatherInfo ? getWeatherIcon(weatherInfo.icon) : '';

  return (
    <div className="bg-white/90 p-3 rounded-lg shadow-md flex flex-col items-start min-w-[250px]">
      {/* Header */}
      <div className="flex justify-between items-start w-full mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <p className="text-xs text-gray-500">{formattedDateTime}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close popup"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        )}
      </div>

      {/* Main Temperature and Icon */}
      <div className="flex items-center gap-3 w-full mb-2">
        {weatherInfo && iconUrl && (
          <img
            src={iconUrl}
            alt={weatherInfo.description}
            className="w-16 h-16"
          />
        )}
        <div>
          <div className="text-4xl font-bold text-gray-800">
            {main ? Math.round(main.temp) : '--'}°C
          </div>
          {weatherInfo && (
            <p className="text-sm text-gray-600 capitalize">
              {weatherInfo.description}
            </p>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 w-full mt-2 pt-2 border-t border-gray-200">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Feels like</span>
          <span className="text-sm font-semibold text-gray-700">
            {main?.feels_like ? Math.round(main.feels_like) : '--'}°C
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Humidity</span>
          <span className="text-sm font-semibold text-gray-700">
            {main?.humidity ?? '--'}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Pressure</span>
          <span className="text-sm font-semibold text-gray-700">
            {main?.pressure ?? '--'} hPa
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Wind</span>
          <span className="text-sm font-semibold text-gray-700">
            {wind?.speed ?? '--'} m/s
          </span>
        </div>
      </div>

      {/* Optional More Details Button */}
      <button
        className="mt-3 w-full py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        aria-label="View more details"
      >
        More Details
      </button>
    </div>
  );
}

