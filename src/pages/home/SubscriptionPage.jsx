import React from 'react';

const SubscriptionPage = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Plans</h2>
      <p className="text-gray-500 mb-8 text-sm">Choose the best plan for your learning journey.</p>
      
      <div className="space-y-4">
        {/* Free Plan */}
        <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:border-blue-500 cursor-pointer transition bg-white">
          <div>
            <h3 className="font-bold text-gray-800">Basic Plan</h3>
            <p className="text-xs text-gray-500">Access to community forums</p>
          </div>
          <span className="text-xl font-bold text-gray-800">Free</span>
        </div>
        
        {/* Pro Plan */}
        <div className="border-2 border-blue-500 bg-blue-50/50 rounded-xl p-6 flex justify-between items-center relative">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
            CURRENT
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Pro Mentorship</h3>
            <p className="text-xs text-blue-600">Weekly sessions & priority support</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-900">$29</span>
            <span className="text-xs text-blue-600">/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
