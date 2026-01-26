import type { Subscription } from '../../types/subscription';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const SubscriptionList = ({ subscriptions, onToggle, onRemove }: SubscriptionListProps) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No subscriptions yet</p>
        <p className="text-xs mt-1">Click on a location to subscribe</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        📧 Your Subscriptions ({subscriptions.length})
      </h3>

      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          className={`p-3 rounded-lg border-2 transition-all ${
            sub.isActive
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200 opacity-60'
          }`}
        >
          {/* Location Info */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm">
                {sub.locationName}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {sub.email}
              </p>
            </div>

            {/* Status Badge */}
            <span
              className={`text-xs px-2 py-1 rounded ${
                sub.isActive
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {sub.isActive ? '✓ Active' : '⏸ Paused'}
            </span>
          </div>

          {/* Subscription Details */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              📅 {sub.frequency}
            </span>
            {sub.alertTypes.map((type) => (
              <span key={type} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {type === 'all' ? '📢 All' : type}
              </span>
            ))}
          </div>

          {/* Created Date */}
          <p className="text-xs text-gray-400 mb-2">
            Subscribed: {new Date(sub.createdAt).toLocaleDateString()}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggle(sub.id)}
              className={`flex-1 text-xs px-3 py-1.5 rounded transition-colors ${
                sub.isActive
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {sub.isActive ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove subscription for ${sub.locationName}?`)) {
                  onRemove(sub.id);
                }
              }}
              className="flex-1 text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

