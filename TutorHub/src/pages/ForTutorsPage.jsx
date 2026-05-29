import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Link } from 'react-router-dom';

const ForTutorsPage = () => (
  <PublicLayout>
    <section className="bg-gradient-to-b from-purple-50 to-white py-20">
      <div className="container-page text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Teach with TutorHub
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-12">
          Share your expertise, set your own rates, and reach thousands of eager learners across Pakistan.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <li className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Flexible Schedule</h3>
            <p className="text-sm text-slate-500">Teach when it works for you – evenings, weekends or anytime.</p>
          </li>
          <li className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Earn What You’re Worth</h3>
            <p className="text-sm text-slate-500">Set your own hourly rate and get paid securely.</p>
          </li>
          <li className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Support & Resources</h3>
            <p className="text-sm text-slate-500">Access teaching tools, marketing help, and a community of peers.</p>
          </li>
        </ul>
        <Link
          to="/register"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
        >
          Become a Tutor Today
        </Link>
      </div>
    </section>
  </PublicLayout>
);

export default ForTutorsPage;
