import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className='min-h-screen bg-neutral-50'>
      {/* Header with gradient - same as BookSessionPage */}
      <div className='bg-gradient-to-r from-primary to-blue-700 py-16 px-4'>
        <div className='max-w-2xl mx-auto text-center'>
          {/* 404 Icon */}
          <div className='mb-6'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm'>
              <svg 
                className='w-12 h-12 text-white' 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24' 
                xmlns='http://www.w3.org/2000/svg'
              >
                <path 
                  strokeLinecap='round' 
                  strokeLinejoin='round' 
                  strokeWidth={2} 
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' 
                />
              </svg>
            </div>
          </div>
          
          <h1 className='text-8xl font-bold text-white mb-4'>404</h1>
          <h2 className='text-3xl font-bold text-white mb-2'>Page Not Found</h2>
          <p className='text-blue-200 text-lg'>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>

      {/* Content Card - same style as BookSessionPage */}
      <div className='max-w-2xl mx-auto px-4 -mt-4 pb-16'>
        <div className='bg-white rounded-3xl shadow-xl p-8 text-center'>
          {/* Animated illustration */}
          <div className='mb-8'>
            <svg 
              className='w-48 h-48 mx-auto text-neutral-300' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24' 
              xmlns='http://www.w3.org/2000/svg'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={1.5} 
                d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
              />
            </svg>
          </div>

       
          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link 
              to='/'
              className='inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all text-sm'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
              Go to Homepage
            </Link>
            
            <Link 
              to='/search'
              className='inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold py-3 px-6 rounded-xl hover:bg-primary/10 transition-all text-sm'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              Find a Tutor
            </Link>
          </div>

          {/* Help text */}
          <div className='mt-8 pt-6 border-t border-neutral-100'>
            <p className='text-neutral-400 text-sm'>
              Need help? Contact our support team at{' '}
              <a href='mailto:support@example.com' className='text-primary hover:underline'>
                support@example.com
              </a>
            </p>
          </div>
        </div>

      
      </div>
    </div>
  );
}

export default NotFoundPage;