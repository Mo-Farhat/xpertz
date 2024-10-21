import React from 'react';
import { Check, X } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  basePrice: number;
  pricePerFeature: number;
  maxFeatures: number;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    basePrice: 9.99,
    pricePerFeature: 1.99,
    maxFeatures: 5,
  },
  {
    id: 'professional',
    name: 'Professional',
    basePrice: 29.99,
    pricePerFeature: 1.49,
    maxFeatures: 15,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    basePrice: 99.99,
    pricePerFeature: 0.99,
    maxFeatures: Infinity,
  },
];

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void;
  selectedPlan: string;
  selectedFeatures: string[];
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan, selectedPlan, selectedFeatures = [] }) => {
  const calculatePrice = (plan: Plan) => {
    const featuresCount = Math.min(selectedFeatures.length, plan.maxFeatures);
    return plan.basePrice + featuresCount * plan.pricePerFeature;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`border rounded-lg p-6 ${
            selectedPlan === plan.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
          }`}
        >
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold mb-4">
            ${calculatePrice(plan).toFixed(2)}
            <span className="text-sm font-normal">/month</span>
          </p>
          <ul className="mb-6">
            <li className="flex items-center mb-2">
              <Check className="text-green-500 mr-2" size={16} />
              Up to {plan.maxFeatures === Infinity ? 'Unlimited' : plan.maxFeatures} features
            </li>
            <li className="flex items-center mb-2">
              <Check className="text-green-500 mr-2" size={16} />
              ${plan.pricePerFeature.toFixed(2)} per additional feature
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan(plan.id)}
            className={`w-full py-2 px-4 rounded ${
              selectedPlan === plan.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;