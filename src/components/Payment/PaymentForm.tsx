import { useState } from 'react';
import type { PaymentMethod } from '../../types/payment';

interface PaymentFormProps {
  planName: string;
  amount: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  onSubmit: (paymentMethodId: string) => Promise<void>;
  onCancel: () => void;
  onAddPaymentMethod: () => void;
}

export const PaymentForm = ({
  planName,
  amount,
  currency,
  paymentMethods,
  onSubmit,
  onCancel,
  onAddPaymentMethod,
}: PaymentFormProps) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    paymentMethods.find((m) => m.isDefault)?.id || paymentMethods[0]?.id || ''
  );
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethodId) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      await onSubmit(selectedMethodId);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          💳 Complete Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{planName} Plan</span>
              <span className="text-xl font-bold text-gray-900">
                ${amount} {currency}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Billed monthly • Auto-renewal enabled
            </p>
          </div>

          {/* Payment Methods */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <button
                type="button"
                onClick={onAddPaymentMethod}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                + Add New
              </button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">No payment methods added</p>
                <button
                  type="button"
                  onClick={onAddPaymentMethod}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Add Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethodId === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethodId === method.id}
                      onChange={(e) => setSelectedMethodId(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {method.type === 'card' && (
                          <>
                            <span className="font-semibold text-gray-800">
                              {method.brand || 'Card'}
                            </span>
                            <span className="text-gray-600">•••• {method.last4}</span>
                          </>
                        )}
                        {method.type === 'paypal' && (
                          <span className="font-semibold text-gray-800">PayPal</span>
                        )}
                        {method.type === 'crypto' && (
                          <span className="font-semibold text-gray-800">Cryptocurrency</span>
                        )}
                        {method.isDefault && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
            <p>
              By confirming, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              You will be charged ${amount} {currency} today and monthly thereafter.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing || paymentMethods.length === 0}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>Pay ${amount}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

