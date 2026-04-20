import { Link } from 'react-router-dom';

export default function TopNavBar({ user, onLogout }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b-2 border-black bg-surface flex justify-between items-center h-14 px-6">
      <div className="flex items-center gap-8">
        <span className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENsly 𝒘ebApp</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-black bg-surface-container">
          <span className="w-2 h-2 bg-green-600"></span>
          <span className="font-mono text-xs font-bold text-black">USER: {user?.name?.toUpperCase() || 'GUEST'}</span>
          <span className="material-symbols-outlined text-black">account_circle</span>
        </div>
      </div>
    </nav>
  );
}