import React from 'react';
import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react';
import { Order } from './types';

interface OrderTimelineProps {
  status: Order['status'];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepStatus = (stepKey: string) => {
    if (status === 'cancelled') return 'cancelled';
    
    const statusIndex = steps.findIndex(step => step.key === status);
    const stepIndex = steps.findIndex(step => step.key === stepKey);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center p-4">
        <XCircle className="h-8 w-8 text-red-500 mr-2" />
        <span className="text-lg font-medium text-red-500">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200" />
      <div className="space-y-8 relative">
        {steps.map((step) => {
          const stepStatus = getStepStatus(step.key);
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`
                relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                ${stepStatus === 'completed' ? 'bg-green-100' : 
                  stepStatus === 'current' ? 'bg-blue-100' : 
                  stepStatus === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'}
              `}>
                <Icon className={`w-8 h-8 
                  ${stepStatus === 'completed' ? 'text-green-600' :
                    stepStatus === 'current' ? 'text-blue-600' :
                    stepStatus === 'cancelled' ? 'text-red-600' : 'text-gray-400'}
                `} />
              </div>
              <div className="ml-4">
                <p className={`font-medium 
                  ${stepStatus === 'completed' ? 'text-green-600' :
                    stepStatus === 'current' ? 'text-blue-600' :
                    stepStatus === 'cancelled' ? 'text-red-600' : 'text-gray-400'}
                `}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;