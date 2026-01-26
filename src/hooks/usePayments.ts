import { useState, useCallback, useEffect } from 'react';
import type { Payment, PaymentMethod, UserSubscriptionPlan, PricingPlan } from '../types/payment';
import { PRICING_PLANS } from '../types/payment';

const PAYMENTS_KEY = 'weather_payments';
const PAYMENT_METHODS_KEY = 'weather_payment_methods';
const USER_PLAN_KEY = 'weather_user_plan';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userPlan, setUserPlan] = useState<UserSubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const storedPayments = localStorage.getItem(PAYMENTS_KEY);
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }

    const storedMethods = localStorage.getItem(PAYMENT_METHODS_KEY);
    if (storedMethods) {
      setPaymentMethods(JSON.parse(storedMethods));
    }

    const storedPlan = localStorage.getItem(USER_PLAN_KEY);
    if (storedPlan) {
      setUserPlan(JSON.parse(storedPlan));
    } else {
      // Default to free plan
      const freePlan: UserSubscriptionPlan = {
        userId: 'default_user',
        planId: 'free',
        status: 'active',
        startDate: Date.now(),
        endDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
        autoRenew: false,
      };
      setUserPlan(freePlan);
      localStorage.setItem(USER_PLAN_KEY, JSON.stringify(freePlan));
    }
  }, []);

  // Save payments to localStorage
  useEffect(() => {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  // Save payment methods to localStorage
  useEffect(() => {
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  // Save user plan to localStorage
  useEffect(() => {
    if (userPlan) {
      localStorage.setItem(USER_PLAN_KEY, JSON.stringify(userPlan));
    }
  }, [userPlan]);

  // Process payment (simulated)
  const processPayment = useCallback(
    async (planId: string, paymentMethodId: string): Promise<Payment> => {
      setLoading(true);
      setError(null);

      try {
        const plan = PRICING_PLANS.find((p) => p.id === planId);
        if (!plan) {
          throw new Error('Invalid plan selected');
        }

        const method = paymentMethods.find((m) => m.id === paymentMethodId);
        if (!method) {
          throw new Error('Invalid payment method');
        }

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate 95% success rate
        const success = Math.random() > 0.05;

        const payment: Payment = {
          id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: 'default_user',
          planId,
          amount: plan.price,
          currency: plan.currency,
          status: success ? 'completed' : 'failed',
          paymentMethod: method.type,
          transactionId: `txn_${Math.random().toString(36).substr(2, 16)}`,
          createdAt: Date.now(),
          paidAt: success ? Date.now() : undefined,
        };

        setPayments((prev) => [payment, ...prev]);

        if (success) {
          // Update user plan
          const newPlan: UserSubscriptionPlan = {
            userId: 'default_user',
            planId,
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            autoRenew: true,
            lastPaymentId: payment.id,
          };
          setUserPlan(newPlan);
        } else {
          throw new Error('Payment failed. Please try again.');
        }

        return payment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [paymentMethods]
  );

  // Add payment method
  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...method,
    };

    // If it's the first method or marked as default, set it as default
    if (paymentMethods.length === 0 || method.isDefault) {
      setPaymentMethods((prev) =>
        [...prev.map((m) => ({ ...m, isDefault: false })), newMethod]
      );
    } else {
      setPaymentMethods((prev) => [...prev, newMethod]);
    }

    return newMethod;
  }, [paymentMethods]);

  // Remove payment method
  const removePaymentMethod = useCallback((methodId: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
  }, []);

  // Set default payment method
  const setDefaultPaymentMethod = useCallback((methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === methodId }))
    );
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(() => {
    if (userPlan) {
      setUserPlan({ ...userPlan, status: 'cancelled', autoRenew: false });
    }
  }, [userPlan]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(() => {
    if (userPlan && userPlan.status === 'cancelled') {
      setUserPlan({ ...userPlan, status: 'active', autoRenew: true });
    }
  }, [userPlan]);

  // Get current plan details
  const getCurrentPlan = useCallback((): PricingPlan | null => {
    if (!userPlan) return null;
    return PRICING_PLANS.find((p) => p.id === userPlan.planId) || null;
  }, [userPlan]);

  // Check if user can add more locations
  const canAddLocation = useCallback(
    (currentCount: number): boolean => {
      const plan = getCurrentPlan();
      if (!plan) return false;
      if (plan.maxLocations === -1) return true; // Unlimited
      return currentCount < plan.maxLocations;
    },
    [getCurrentPlan]
  );

  return {
    payments,
    paymentMethods,
    userPlan,
    loading,
    error,
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    cancelSubscription,
    reactivateSubscription,
    getCurrentPlan,
    canAddLocation,
  };
}

