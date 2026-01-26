import { useState, useCallback, useEffect } from 'react';
import type { Subscription, SubscriptionFormData, WeatherAlert } from '../types/subscription';

const STORAGE_KEY = 'weather_subscriptions';
const ALERTS_KEY = 'weather_alerts';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // Load subscriptions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSubscriptions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      }
    }

    const storedAlerts = localStorage.getItem(ALERTS_KEY);
    if (storedAlerts) {
      try {
        setAlerts(JSON.parse(storedAlerts));
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    }
  }, []);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const addSubscription = useCallback((data: SubscriptionFormData) => {
    setLoading(true);

    try {
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        locationName: data.locationName,
        coordinates: data.coordinates,
        email: data.email,
        frequency: data.frequency,
        alertTypes: data.alertTypes,
        isActive: true,
        createdAt: Date.now(),
      };

      setSubscriptions((prev) => [...prev, newSubscription]);

      // Create a welcome alert
      const welcomeAlert: WeatherAlert = {
        id: `alert_${Date.now()}`,
        subscriptionId: newSubscription.id,
        message: `Successfully subscribed to weather updates for ${data.locationName}! You'll receive ${data.frequency} notifications.`,
        severity: 'info',
        timestamp: Date.now(),
        read: false,
      };

      setAlerts((prev) => [welcomeAlert, ...prev]);

      return newSubscription;
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));

    // Remove associated alerts
    setAlerts((prev) => prev.filter((alert) => alert.subscriptionId !== subscriptionId));
  }, []);

  const toggleSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
  }, []);

  const updateSubscription = useCallback((subscriptionId: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, ...updates, lastUpdate: Date.now() } : sub
      )
    );
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getActiveSubscriptions = useCallback(() => {
    return subscriptions.filter((sub) => sub.isActive);
  }, [subscriptions]);

  const getUnreadAlerts = useCallback(() => {
    return alerts.filter((alert) => !alert.read);
  }, [alerts]);

  // Simulate checking for weather alerts (in real app, this would be a backend job)
  const checkForWeatherAlerts = useCallback(() => {
    const activeSubscriptions = getActiveSubscriptions();

    activeSubscriptions.forEach((sub) => {
      // Simulate random weather alert generation
      if (Math.random() > 0.95) { // 5% chance
        const alert: WeatherAlert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          subscriptionId: sub.id,
          message: `Weather update for ${sub.locationName}: Temperature change detected!`,
          severity: Math.random() > 0.7 ? 'warning' : 'info',
          timestamp: Date.now(),
          read: false,
        };

        setAlerts((prev) => [alert, ...prev]);
      }
    });
  }, [getActiveSubscriptions]);

  return {
    subscriptions,
    alerts,
    loading,
    addSubscription,
    removeSubscription,
    toggleSubscription,
    updateSubscription,
    markAlertAsRead,
    clearAllAlerts,
    getActiveSubscriptions,
    getUnreadAlerts,
    checkForWeatherAlerts,
  };
}

