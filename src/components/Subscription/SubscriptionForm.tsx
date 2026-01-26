import { useState } from 'react';
import type { SubscriptionFormData, AlertType } from '../../types/subscription';

interface SubscriptionFormProps {
  locationName: string;
  coordinates: { lat: number; lon: number };
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
}

export const SubscriptionForm = ({
  locationName,
  coordinates,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [selectedAlerts, setSelectedAlerts] = useState<AlertType[]>(['all']);

  const handleAlertToggle = (alertType: AlertType) => {
    if (alertType === 'all') {
      setSelectedAlerts(['all']);
      return;
    }

    setSelectedAlerts((prev) => {
      const filtered = prev.filter((a) => a !== 'all');
      if (filtered.includes(alertType)) {
        return filtered.filter((a) => a !== alertType);
      }
      return [...filtered, alertType];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    onSubmit({
      locationName,
      coordinates,
      email,
      frequency,
      alertTypes: selectedAlerts.length > 0 ? selectedAlerts : ['all'],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📧 Subscribe to Weather Alerts
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Display */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-800">{locationName}</p>
            <p className="text-xs text-gray-500">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Frequency
            </label>
            <div className="space-y-2">
              {(['hourly', 'daily', 'weekly'] as const).map((freq) => (
                <label key={freq} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={frequency === freq}
                    onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">{freq}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Types
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: '📢 All Weather Updates' },
                { value: 'temperature', label: '🌡️ Temperature Changes' },
                { value: 'precipitation', label: '🌧️ Precipitation Alerts' },
                { value: 'wind', label: '💨 Wind Warnings' },
                { value: 'severe-weather', label: '⚠️ Severe Weather Only' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(value as AlertType)}
                    onChange={() => handleAlertToggle(value as AlertType)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can manage your subscriptions anytime from the sidebar
        </p>
      </div>
    </div>
  );
};

