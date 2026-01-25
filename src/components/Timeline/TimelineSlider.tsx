interface TimelineSliderProps {
  currentIndex: number;
  maxIndex: number;
  onSliderChange: (index: number) => void;
  timeSlots: Array<{
    timestamp: number;
    label: string;
    date: string;
  }>;
}

export const TimelineSlider = ({
  currentIndex,
  maxIndex,
  onSliderChange,
  timeSlots,
}: TimelineSliderProps) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliderChange(parseInt(e.target.value));
  };

  const handleMarkerClick = (index: number) => {
    onSliderChange(index);
  };

  // Calculate percentage for slider fill
  const percentage = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  return (
    <div className="w-full">
      {/* Slider Track */}
      <div className="relative mb-4">
        {/* Custom styled range input */}
        <div className="relative h-2 bg-gray-200 rounded-lg overflow-hidden">
          {/* Progress fill */}
          <div
            className="absolute h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native range input (invisible but functional) */}
        <input
          type="range"
          min="0"
          max={maxIndex}
          value={currentIndex}
          onChange={handleSliderChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
          aria-label="Time slider"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={currentIndex}
        />

        {/* Slider thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transition-all duration-300 ease-out pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>

      {/* Time Markers */}
      <div className="flex justify-between items-center px-1">
        {timeSlots.map((slot, index) => (
          <button
            key={slot.timestamp}
            onClick={() => handleMarkerClick(index)}
            className={`flex flex-col items-center transition-all duration-200 ${
              index === currentIndex
                ? 'text-blue-600 font-semibold scale-110'
                : 'text-gray-500 hover:text-gray-700 hover:scale-105'
            }`}
            title={`${slot.date} ${slot.label}`}
            aria-label={`Select time: ${slot.label}`}
          >
            {/* Time label */}
            <span className="text-xs whitespace-nowrap">{slot.label}</span>

            {/* Active indicator dot */}
            {index === currentIndex && (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />
            )}
          </button>
        ))}
      </div>

      {/* Additional info: selected time range */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            {timeSlots[currentIndex].date}
          </span>
          {' at '}
          <span className="font-medium text-gray-700">
            {timeSlots[currentIndex].label}
          </span>
        </p>
      </div>
    </div>
  );
};

