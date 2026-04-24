// RegisterSuccessPage.jsx — shown after registration, before email verification
import { useLocation, Link } from "react-router-dom";

const RegisterSuccessPage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";
  // location.state carries the email we passed via navigate("/register/success", {state})

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Green envelope icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success-light rounded-full mb-6 mx-auto">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Check your inbox
        </h1>
        
        <p className="text-neutral-500 text-sm mb-2">
          We sent a verification link to
        </p>
        
        <p className="font-semibold text-neutral-900 text-lg mb-6">
          {email}
        </p>
        
        <p className="text-neutral-400 text-xs mb-8 leading-relaxed">
          Click the link in the email to verify your account.
          During development, check the backend console — the link is
          printed there by the EmailService stub.
        </p>
        
        <Link 
          to="/login"
          className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-250"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;