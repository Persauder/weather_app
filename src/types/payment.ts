export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxLocations: number;
  alertFrequency: ('hourly' | 'daily' | 'weekly')[];
  recommended?: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'crypto';
  transactionId: string;
  createdAt: number;
  paidAt?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string; // For cards
  brand?: string; // Visa, Mastercard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface UserSubscriptionPlan {
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: number;
  endDate: number;
  autoRenew: boolean;
  lastPaymentId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      '1 location',
      'Daily updates',
      'Basic weather alerts',
      'Email notifications',
    ],
    maxLocations: 1,
    alertFrequency: ['daily'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      '5 locations',
      'Hourly or daily updates',
      'All weather alerts',
      'Email & SMS notifications',
      'Weather history',
    ],
    maxLocations: 5,
    alertFrequency: ['hourly', 'daily'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    recommended: true,
    features: [
      '20 locations',
      'Real-time updates',
      'Advanced weather alerts',
      'Email, SMS & Push notifications',
      'Weather history & forecasts',
      'API access',
      'Priority support',
    ],
    maxLocations: 20,
    alertFrequency: ['hourly', 'daily', 'weekly'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited locations',
      'Real-time updates',
      'Custom alert rules',
      'All notification types',
      'Full weather data access',
      'API access with higher limits',
      'Dedicated support',
      'Custom integrations',
    ],
    maxLocations: -1, // Unlimited
    alertFrequency: ['hourly', 'daily', 'weekly'],
  },
];

