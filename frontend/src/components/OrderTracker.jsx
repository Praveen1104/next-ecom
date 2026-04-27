'use client';

import { Check, Package, Truck, Home, XCircle } from 'lucide-react';

const statuses = [
  { id: 'Processing', label: 'Order Placed', icon: Package },
  { id: 'Shipped', label: 'Shipped', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: Home },
];

export default function OrderTracker({ currentStatus, history }) {
  const isCancelled = currentStatus === 'Cancelled';
  
  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl flex items-center space-x-4 border border-red-100 dark:border-red-900/30">
        <XCircle className="w-8 h-8 text-red-600" />
        <div>
          <h3 className="font-bold text-red-900 dark:text-red-400">Order Cancelled</h3>
          <p className="text-sm text-red-700 dark:text-red-500">This order has been cancelled and a refund has been initiated.</p>
        </div>
      </div>
    );
  }

  const currentStep = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div className="py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-1000"
          style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {statuses.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                      : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-sm font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {history?.find(h => h.status === step.id) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(history.find(h => h.status === step.id).timestamp).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
