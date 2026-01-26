export interface Subscription {
  id: string;
  locationName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  email: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  alertTypes: AlertType[];
  isActive: boolean;
  createdAt: number;
  lastUpdate?: number;
}

export type AlertType =
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'severe-weather'
  | 'all';

export interface SubscriptionFormData {
  locationName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  email: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  alertTypes: AlertType[];
}

export interface WeatherAlert {
  id: string;
  subscriptionId: string;
  message: string;
  severity: 'info' | 'warning' | 'severe';
  timestamp: number;
  read: boolean;
}

