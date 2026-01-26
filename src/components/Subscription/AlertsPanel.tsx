import type { WeatherAlert } from '../../types/subscription';

interface AlertsPanelProps {
  alerts: WeatherAlert[];
  onMarkAsRead: (alertId: string) => void;
  onClearAll: () => void;
}

export const AlertsPanel = ({ alerts, onMarkAsRead, onClearAll }: AlertsPanelProps) => {
  const unreadCount = alerts.filter((alert) => !alert.read).length;

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No alerts yet</p>
        <p className="text-xs mt-1">You'll see weather alerts here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          🔔 Alerts
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {alerts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border-l-4 transition-all cursor-pointer ${
              alert.read
                ? 'bg-gray-50 border-gray-300 opacity-60'
                : getSeverityStyles(alert.severity)
            }`}
            onClick={() => !alert.read && onMarkAsRead(alert.id)}
          >
            {/* Alert Header */}
            <div className="flex items-start justify-between mb-1">
              <span className="text-xs font-semibold text-gray-700">
                {getSeverityIcon(alert.severity)} {getSeverityLabel(alert.severity)}
              </span>
              {!alert.read && (
                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
              )}
            </div>

            {/* Alert Message */}
            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>

            {/* Timestamp */}
            <p className="text-xs text-gray-400">
              {new Date(alert.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

function getSeverityStyles(severity: WeatherAlert['severity']): string {
  switch (severity) {
    case 'info':
      return 'bg-blue-50 border-blue-400';
    case 'warning':
      return 'bg-yellow-50 border-yellow-400';
    case 'severe':
      return 'bg-red-50 border-red-500';
  }
}

function getSeverityIcon(severity: WeatherAlert['severity']): string {
  switch (severity) {
    case 'info':
      return 'ℹ️';
    case 'warning':
      return '⚠️';
    case 'severe':
      return '🚨';
  }
}

function getSeverityLabel(severity: WeatherAlert['severity']): string {
  switch (severity) {
    case 'info':
      return 'Info';
    case 'warning':
      return 'Warning';
    case 'severe':
      return 'Severe Alert';
  }
}

