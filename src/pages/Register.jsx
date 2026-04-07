/**
 * ============================================================
 * PAGE: Register (Registration Page)
 * ============================================================
 * Description: 
 *   Registration form for new users.
 *   Requires password match validation.
 * 
 * Location: src/pages/Register.jsx
 * 
 * Routing:
 *   - Accessible from /register
 *   - Redirects to /dashboard if already logged in
 *   - Link to /login for existing users
 * 
 * Form fields:
 *   - name: Full name of the user
 *   - email: Email address
 *   - password: Password
 *   - passwordConfirmation: Password confirmation
 * 
 * Validations:
 *   1. Client-side: Passwords must match
 *   2. Server-side: Unique email, password requirements
 * 
 * Integration:
 *   - Uses useAuth() hook from context
 *   - Calls register(name, email, password, confirmation)
 *   - Navigates to /dashboard after successful registration
 * 
 * Technical notes:
 *   - Requires password_confirmation field for Laravel
 *   - Password validation is done client-side first
 *   - Shows backend validation errors if any
 * ============================================================
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // ============================================================
  // COMPONENT STATES
  // ============================================================
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // ============================================================
  // HANDLER: handleSubmit
  // Description: Handles registration form submission
  // Validations: Password match before sending
  // Flow: Validate → Call API → Save token → Redirect
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side password validation
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/dashboard');
    } catch (err) {
      // Extract error message - can come from different paths
      const message = err.response?.data?.message || 
                      err.response?.data?.errors?.password?.[0] || 
                      'Registration error. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ============================================================
        MAIN CONTAINER
        Layout: Flex column | Min-height: 100vh | Background: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECTION 1: HEADER
          Description: Top bar with logo and login button
       ============================================================ */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENsly 𝒘ebApp</Link>
        </div>
      </header>

      {/* ============================================================
          SECTION 2: REGISTRATION FORM
          Description: Central area with account creation form
          Layout: Centered with max-width 512px
       ============================================================ */}
      <main className="flex-grow flex items-center justify-center p-8 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        
        <div className="relative w-full max-w-md">
          
          {/* Badge and title */}
          <div className="mb-6">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">REGISTRATION MODULE</span>
          </div>
          
          <h1 className="font-sans font-bold text-4xl mb-2">CREATE ACCOUNT</h1>
          <p className="font-label text-sm text-on-surface-variant mb-8">Fill in all fields</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-white">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error text-sm font-label">
                ERROR: {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Field: Name */}
              <div>
                <label htmlFor="name" className="block font-label text-xs uppercase mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
                  placeholder="FIRSTNAME LASTNAME"
                  required
                />
              </div>

              {/* Field: Email */}
              <div>
                <label htmlFor="email" className="block font-label text-xs uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
                  placeholder="user@domain.ext"
                  required
                />
              </div>

              {/* Field: Password */}
              <div>
                <label htmlFor="password" className="block font-label text-xs uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              {/* Field: Confirm password */}
              <div>
                <label htmlFor="passwordConfirmation" className="block font-label text-xs uppercase mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-sans font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'PROCESSING...' : 'REGISTER'}
              </button>
            </div>
          </form>

          {/* Link to login */}
          <div className="mt-6 text-center">
            <p className="font-label text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-bold">
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ============================================================
          SECTION 3: FOOTER
          Description: Footer with version and timestamp
       ============================================================ */}
      <footer className="flex justify-between items-center px-6 py-4 w-full border-t-2 border-black bg-surface-dim">
        <div className="mb-4 md:mb-0">
          <span className="font-mono text-xs uppercase tracking-widest text-black">© 𝓁.2077</span>
        </div>
        <div className="mt-4 md:mt-0 font-label text-[10px]">
          INCIDENsly 𝒘ebApp v._STABLE_BUILD
        </div>
      </footer>
    </div>
  );
}