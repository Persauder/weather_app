import { useState } from 'react';
import { PricingCards } from '../Payment/PricingCards';
import { PaymentForm } from '../Payment/PaymentForm';
import { AddPaymentMethodForm } from '../Payment/AddPaymentMethodForm';
import type { UserSubscriptionPlan, Payment, PaymentMethod } from '../../types/payment';
import { PRICING_PLANS } from '../../types/payment';

interface SubscriptionManagementProps {
  userPlan: UserSubscriptionPlan | null;
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  onProcessPayment: (planId: string, paymentMethodId: string) => Promise<void>;
  onAddPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => PaymentMethod;
  onCancelSubscription: () => void;
  onReactivateSubscription: () => void;
  onClose?: () => void;
}

export const SubscriptionManagement = ({
  userPlan,
  payments,
  paymentMethods,
  onProcessPayment,
  onAddPaymentMethod,
  onCancelSubscription,
  onReactivateSubscription,
  onClose,
}: SubscriptionManagementProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  const currentPlan = PRICING_PLANS.find((p) => p.id === userPlan?.planId);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // Downgrade to free - confirm
      if (confirm('Downgrade to Free plan? You will lose premium features.')) {
        // Handle downgrade logic
        onCancelSubscription();
      }
      return;
    }

    setSelectedPlanId(planId);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (paymentMethodId: string) => {
    if (!selectedPlanId) return;

    try {
      await onProcessPayment(selectedPlanId, paymentMethodId);
      setShowPaymentForm(false);
      setSelectedPlanId(null);
      alert('✅ Payment successful! Your subscription has been upgraded.');
    } catch (error) {
      alert('❌ Payment failed. Please try again.');
    }
  };

  const handleAddPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    onAddPaymentMethod(method);
    setShowAddPaymentMethod(false);
  };

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId);

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm overflow-y-auto z-[1500]">
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">💎 Subscription Plans</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-300 mt-2">
            Choose the perfect plan for your weather monitoring needs
          </p>
        </div>

        {/* Current Plan Status */}
        {userPlan && currentPlan && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Current Plan</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{currentPlan.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {userPlan.status === 'active' ? (
                      <>
                        Active until{' '}
                        <span className="font-semibold">
                          {new Date(userPlan.endDate).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-orange-600 font-semibold">
                        {userPlan.status.toUpperCase()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {userPlan.status === 'active' && userPlan.planId !== 'free' && (
                    <button
                      onClick={onCancelSubscription}
                      className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  )}
                  {userPlan.status === 'cancelled' && (
                    <button
                      onClick={onReactivateSubscription}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto">
          <PricingCards currentPlanId={userPlan?.planId} onSelectPlan={handleSelectPlan} />
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Payment History</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.slice(0, 10).map((payment) => {
                    const plan = PRICING_PLANS.find((p) => p.id === payment.planId);
                    return (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{plan?.name || payment.planId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${payment.amount} {payment.currency}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{payment.transactionId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedPlan && (
        <PaymentForm
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          currency={selectedPlan.currency}
          paymentMethods={paymentMethods}
          onSubmit={handlePaymentSubmit}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedPlanId(null);
          }}
          onAddPaymentMethod={() => setShowAddPaymentMethod(true)}
        />
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentMethod && (
        <AddPaymentMethodForm
          onSubmit={handleAddPaymentMethod}
          onCancel={() => setShowAddPaymentMethod(false)}
        />
      )}
    </div>
  );
};

