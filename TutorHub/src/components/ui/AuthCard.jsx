import React from 'react';

/**
 * AuthCard – a reusable container for authentication pages.
 * It centers its children both vertically and horizontally, provides a
 * semi‑transparent glass‑morphism background and responsive width.
 */
const AuthCard = ({ children, title }) => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
    <div className="w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-md shadow-xl p-8">
      {title && <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">{title}</h2>}
      {children}
    </div>
  </div>
);

export default AuthCard;
