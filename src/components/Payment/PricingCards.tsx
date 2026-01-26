import { PRICING_PLANS } from '../../types/payment';
import type { PricingPlan } from '../../types/payment';

interface PricingCardsProps {
  currentPlanId?: string;
  onSelectPlan: (planId: string) => void;
}

export const PricingCards = ({ currentPlanId, onSelectPlan }: PricingCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PRICING_PLANS.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrent={currentPlanId === plan.id}
          onSelect={() => onSelectPlan(plan.id)}
        />
      ))}
    </div>
  );
};

interface PlanCardProps {
  plan: PricingPlan;
  isCurrent: boolean;
  onSelect: () => void;
}

const PlanCard = ({ plan, isCurrent, onSelect }: PlanCardProps) => {
  return (
    <div
      className={`relative rounded-lg border-2 p-6 flex flex-col ${
        plan.recommended
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
          : isCurrent
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Recommended Badge */}
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ RECOMMENDED
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ✓ CURRENT
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-600 ml-2">/ {plan.interval}</span>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isCurrent
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : plan.recommended
            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
            : 'bg-gray-800 text-white hover:bg-gray-900'
        }`}
      >
        {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
      </button>

      {/* Additional Info */}
      {plan.maxLocations !== -1 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Up to {plan.maxLocations} location{plan.maxLocations > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

