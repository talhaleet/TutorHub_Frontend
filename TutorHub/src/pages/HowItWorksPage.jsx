// src/pages/HowItWorksPage.jsx
import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Find a Tutor',
    description: 'Search by subject, location, or rating and pick the perfect match for your child.',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Book a Session',
    description: 'Choose a convenient time slot, pay securely and receive a confirmation instantly.',
    icon: (
      <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
  {
    title: 'Learn & Grow',
    description: 'Attend live sessions, get homework help and track progress with detailed reports.',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0 1 12 21.5c-2.28-.97-4.33-2.43-5.96-4.292L12 14z" />
      </svg>
    ),
  },
];

const HowItWorksPage = () => (
  <PublicLayout>
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container-page text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          How TutorHub Works
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-12">
          A simple three‑step process that connects students with qualified tutors, makes scheduling painless, and tracks learning progress.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.title} className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-4">
                {step.icon}
                <h2 className="text-xl font-bold text-slate-800">{step.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default HowItWorksPage;
