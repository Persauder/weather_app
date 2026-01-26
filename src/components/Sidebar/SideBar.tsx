import { useState } from 'react';
import type { Subscription, WeatherAlert } from '../../types/subscription';
import { SubscriptionList } from '../Subscription/SubscriptionList';
import { AlertsPanel } from '../Subscription/AlertsPanel';

interface LayerConfig {
  id: string;
  name: string;
  enabled: boolean;
  opacity?: number;
}

interface SidebarProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string, enabled: boolean) => void;
  onSetLayerOpacity?: (id: string, opacity: number) => void;
  onCenterToUser?: () => void;
  subscriptions?: Subscription[];
  alerts?: WeatherAlert[];
  onToggleSubscription?: (id: string) => void;
  onRemoveSubscription?: (id: string) => void;
  onMarkAlertAsRead?: (id: string) => void;
  onClearAllAlerts?: () => void;
}

type TabType = 'layers' | 'subscriptions' | 'alerts';

export function Sidebar({
  layers,
  onToggleLayer,
  onSetLayerOpacity,
  onCenterToUser,
  subscriptions = [],
  alerts = [],
  onToggleSubscription,
  onRemoveSubscription,
  onMarkAlertAsRead,
  onClearAllAlerts,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('layers');

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="w-72 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-h-[85vh] flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Center</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeTab === 'layers'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🗺️ Layers
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors relative ${
            activeTab === 'subscriptions'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📧 Subs
          {subscriptions.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {subscriptions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors relative ${
            activeTab === 'alerts'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🔔 Alerts
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Layers Tab */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            {/* Center to User Button */}
            {onCenterToUser && (
              <button
                onClick={onCenterToUser}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                📍 My Location
              </button>
            )}

            {/* Layers List */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Weather Layers</h3>
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div key={layer.id} className="bg-white/80 p-2 rounded">
                    {/* ...existing layer code... */}
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={layer.enabled}
                          onChange={(e) => onToggleLayer(layer.id, e.target.checked)}
                          className="mr-2 h-4 w-4 accent-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{layer.name}</span>
                      </label>
                    </div>

                    {onSetLayerOpacity && layer.enabled && (
                      <div className="ml-6">
                        <label className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Opacity:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(layer.opacity ?? 1) * 100}
                            onChange={(e) => onSetLayerOpacity(layer.id, Number(e.target.value) / 100)}
                            className="flex-1 h-1 accent-blue-500"
                          />
                          <span className="text-xs text-gray-600 w-8">
                            {Math.round((layer.opacity ?? 1) * 100)}%
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Temperature Legend */}
            <div className="bg-white/80 p-3 rounded">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Temperature Scale</h3>
              <div className="space-y-2">
                <div className="h-6 rounded" style={{
                  background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
                }}></div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>-20°C</span>
                  <span>0°C</span>
                  <span>20°C</span>
                  <span>40°C</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && onToggleSubscription && onRemoveSubscription && (
          <SubscriptionList
            subscriptions={subscriptions}
            onToggle={onToggleSubscription}
            onRemove={onRemoveSubscription}
          />
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && onMarkAlertAsRead && onClearAllAlerts && (
          <AlertsPanel
            alerts={alerts}
            onMarkAsRead={onMarkAlertAsRead}
            onClearAll={onClearAllAlerts}
          />
        )}
      </div>
    </div>
  );
}

