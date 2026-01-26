import { useState } from 'react';

interface TimelineProps {
  onTimeChange?: (timestamp: number) => void;
  isPlaying?: boolean;
  onPlayPause?: (playing: boolean) => void;
}

export const Timeline = ({ onTimeChange, isPlaying = false, onPlayPause }: TimelineProps) => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);

  // Generate time slots (current + next 24 hours, every 3 hours)
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    now.setMinutes(0, 0, 0);

    for (let i = 0; i < 9; i++) {
      const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      slots.push({
        timestamp: time.getTime(),
        label: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (index: number) => {
    setSelectedTimeIndex(index);
    if (onTimeChange) {
      onTimeChange(timeSlots[index].timestamp);
    }
  };

  const handlePlayPause = () => {
    if (onPlayPause) {
      onPlayPause(!isPlaying);
    }
  };

  const handlePrevious = () => {
    if (selectedTimeIndex > 0) {
      handleTimeSelect(selectedTimeIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedTimeIndex < timeSlots.length - 1) {
      handleTimeSelect(selectedTimeIndex + 1);
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[600px]">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={selectedTimeIndex === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous"
            aria-label="Previous time slot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={selectedTimeIndex === timeSlots.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next"
            aria-label="Next time slot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Selected Time */}
        <div className="text-sm">
          <span className="font-semibold text-gray-800">{timeSlots[selectedTimeIndex].label}</span>
          <span className="text-gray-500 ml-2">{timeSlots[selectedTimeIndex].date}</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max={timeSlots.length - 1}
          value={selectedTimeIndex}
          onChange={(e) => handleTimeSelect(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          aria-label="Time slider"
        />

        {/* Time Markers */}
        <div className="flex justify-between mt-2 px-1">
          {timeSlots.map((slot, index) => (
            <button
              key={slot.timestamp}
              onClick={() => handleTimeSelect(index)}
              className={`text-xs transition-colors ${
                index === selectedTimeIndex
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={`${slot.date} ${slot.label}`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

