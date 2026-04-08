/**
 * ============================================================
 * COMPONENT: LogoutModal
 * ============================================================
 * Confirmation dialog for logout action.
 * Extracted from SideNavBar to follow Single Responsibility.
 * 
 * Props:
 *   - isOpen: boolean
 *   - onClose: function
 *   - onConfirm: function
 * ============================================================
 */

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white shadow-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-surface-container">
          <h2 className="font-sans font-bold text-lg uppercase">LOGOUT</h2>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-gray-500 hover:text-black transition-colors"
          >
            close
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 24 24" className="mx-auto mb-4 text-red-600">
              <title xmlns="">account-alert-loop</title>
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <g strokeDasharray="22">
                  <path d="M5 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="22;0"/>
                  </path>
                  <path strokeDashoffset="22" d="M11 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" to="0"/>
                  </path>
                </g>
                <path strokeDasharray="6" strokeDashoffset="6" d="M20 3v4">
                  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
                  <animate attributeName="stroke-width" begin="0.9s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"/>
                </path>
                <path strokeDasharray="4" strokeDashoffset="4" d="M20 11v0.01">
                  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" to="0"/>
                  <animate attributeName="stroke-width" begin="1.2s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"/>
                </path>
              </g>
            </svg>
          </div>
          <p className="font-mono text-sm text-gray-700 mb-6">
            Are you sure you want to logout from INCIDENsly 𝒘ebApp?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-black font-mono text-xs uppercase hover:bg-gray-100 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-primary text-white font-mono text-xs uppercase hover:bg-neutral-800 transition-colors"
            >
              CONFIRM LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
