interface TemperatureScaleProps {
  unit?: 'C' | 'F';
  compact?: boolean;
}

export const TemperatureScale = ({ unit = 'C', compact = false }: TemperatureScaleProps) => {
  // Temperature ranges with colors (cold to hot)
  const temperatureGradient = [
    { temp: -30, color: '#1a0066', label: '-30°' },
    { temp: -20, color: '#2e00cc', label: '-20°' },
    { temp: -10, color: '#0066ff', label: '-10°' },
    { temp: 0, color: '#00ccff', label: '0°' },
    { temp: 10, color: '#00ff99', label: '10°' },
    { temp: 20, color: '#66ff00', label: '20°' },
    { temp: 30, color: '#ffff00', label: '30°' },
    { temp: 35, color: '#ffcc00', label: '35°' },
    { temp: 40, color: '#ff6600', label: '40°' },
    { temp: 45, color: '#ff0000', label: '45°' },
    { temp: 50, color: '#cc0000', label: '50°' },
  ];

  // Convert to Fahrenheit if needed
  const convertTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  // Create gradient string for CSS
  const gradientString = temperatureGradient
    .map((item, index) => {
      const percentage = (index / (temperatureGradient.length - 1)) * 100;
      return `${item.color} ${percentage}%`;
    })
    .join(', ');

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md ${compact ? 'p-2' : 'p-4'}`}>
      {/* Title */}
      <h4 className={`font-semibold text-gray-800 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
        Temperature Scale ({unit === 'C' ? '°C' : '°F'})
      </h4>

      {/* Gradient Bar */}
      <div className="relative">
        {/* Main gradient */}
        <div
          className={`w-full rounded ${compact ? 'h-6' : 'h-8'} shadow-inner`}
          style={{
            background: `linear-gradient(to right, ${gradientString})`,
          }}
        />

        {/* Temperature markers */}
        {!compact && (
          <div className="relative w-full mt-2">
            <div className="flex justify-between items-center">
              {temperatureGradient
                .filter((_, index) => index % 2 === 0) // Show every other marker
                .map((item) => (
                  <div
                    key={item.temp}
                    className="flex flex-col items-center"
                    style={{ flex: 1 }}
                  >
                    {/* Tick mark */}
                    <div className="w-px h-2 bg-gray-400 mb-1" />
                    {/* Temperature label */}
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {convertTemp(item.temp)}°
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Compact version: just min and max */}
        {compact && (
          <div className="flex justify-between mt-1 px-1">
            <span className="text-xs text-gray-600">
              {convertTemp(temperatureGradient[0].temp)}°
            </span>
            <span className="text-xs text-gray-600">
              {convertTemp(temperatureGradient[temperatureGradient.length - 1].temp)}°
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Color indicates temperature range
        </p>
      )}
    </div>
  );
};

