import { useState } from 'react';
import type { PaymentMethod } from '../../types/payment';

interface AddPaymentMethodFormProps {
  onSubmit: (method: Omit<PaymentMethod, 'id'>) => void;
  onCancel: () => void;
}

export const AddPaymentMethodForm = ({ onSubmit, onCancel }: AddPaymentMethodFormProps) => {
  const [methodType, setMethodType] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (methodType === 'card') {
      if (!cardNumber || cardNumber.length < 13) {
        alert('Please enter a valid card number');
        return;
      }
      if (!expiryMonth || !expiryYear) {
        alert('Please enter expiry date');
        return;
      }
      if (!cvv || cvv.length < 3) {
        alert('Please enter CVV');
        return;
      }

      onSubmit({
        type: 'card',
        last4: cardNumber.slice(-4),
        brand: detectCardBrand(cardNumber),
        expiryMonth: parseInt(expiryMonth),
        expiryYear: parseInt(expiryYear),
        isDefault,
      });
    } else {
      onSubmit({
        type: methodType,
        isDefault,
      });
    }
  };

  const detectCardBrand = (number: string): string => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2001]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          💳 Add Payment Method
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'card', label: '💳 Card', icon: '💳' },
                { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                { value: 'crypto', label: 'Crypto', icon: '₿' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setMethodType(type.value as typeof methodType)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    methodType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details */}
          {methodType === 'card' && (
            <>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                    Month *
                  </label>
                  <input
                    id="expiryMonth"
                    type="text"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    placeholder="MM"
                    maxLength={2}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    id="expiryYear"
                    type="text"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="YYYY"
                    maxLength={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          {/* PayPal */}
          {methodType === 'paypal' && (
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-2">
                You'll be redirected to PayPal to complete the setup
              </p>
              <div className="text-4xl">🅿️</div>
            </div>
          )}

          {/* Crypto */}
          {methodType === 'crypto' && (
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-2">
                You'll be able to pay with Bitcoin, Ethereum, or other cryptocurrencies
              </p>
              <div className="text-4xl">₿</div>
            </div>
          )}

          {/* Set as Default */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Set as default payment method</span>
          </label>

          {/* Security Note */}
          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
            <p>
              🔒 Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

