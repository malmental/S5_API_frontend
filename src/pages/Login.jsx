import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Extract error message from response or use fallback
      const message = err.response?.data?.message || 
                      err.response?.data?.error ||
                      'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono font-bold text-xl border-black px-2 py-1">INCIDENsly 𝒘ebApp</Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 stippled-bg"></div>
        <div className="relative w-full max-w-md">
          <div className="mb-6">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">AUTHENTICATION MODULE</span>
          </div>
          <h1 className="font-sans font-bold text-4xl mb-2">SIGN IN</h1>
          <p className="font-label text-sm text-on-surface-variant mb-8">Enter your credentials.</p>
          <form onSubmit={handleSubmit} className="p-6 bg-white">
            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error text-sm font-label">
                ERROR: {error}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block font-label text-xs uppercase mb-2">
                  Email / Username
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface font-mono text-sm"
                  placeholder="user@domain.ext"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-label text-xs uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface font-mono text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-sans font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="font-label text-xs text-on-surface-variant">
              No account?{' '}
              <Link to="/register" className="text-primary hover:underline font-bold">
                REQUEST REGISTRATION
              </Link>
            </p>
          </div>
        </div>
      </main>

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