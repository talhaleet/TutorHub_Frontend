import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';

const plans = [
  {
    name: 'Starter',
    price: '₨ 499',
    features: ['Up to 5 sessions', 'Basic support', 'Email notifications'],
  },
  {
    name: 'Pro',
    price: '₨ 1,299',
    features: ['Unlimited sessions', 'Priority support', 'SMS alerts', 'Discounted rates'],
  },
  {
    name: 'Premium',
    price: '₨ 2,499',
    features: [
      'All Pro features',
      'Dedicated account manager',
      'Custom branding',
    ],
  },
];

const PricingPage = () => (
  <PublicLayout>
    <section className="bg-gray-50 py-20">
      <div className="container-page text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Pricing Plans</h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-12">
          Choose the plan that fits your learning or teaching needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h2>
              <p className="text-3xl font-extrabold text-blue-600 mb-4">
                {plan.price}<span className="text-base font-medium">/mo</span>
              </p>
              <ul className="flex-1 mb-6 space-y-2 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-colors">
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default PricingPage;
