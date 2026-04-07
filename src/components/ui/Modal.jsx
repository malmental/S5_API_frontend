/**
 * ============================================================
 * COMPONENT: Modal (Floating Window)
 * ============================================================
 * Description: 
 *   Reusable modal component for floating windows.
 *   Used to create/edit incidences and view details.
 * 
 * Location: src/components/ui/Modal.jsx
 * 
 * Props:
 *   - isOpen: Boolean that controls visibility
 *   - onClose: Function to close modal
 *   - title: Modal title
 *   - children: Modal content
 *   - size: Size ('sm', 'md', 'lg')
 * 
 * Characteristics:
 *   - Overlay background with click to close
 *   - Entry/exit animation
 *   - Design with black borders (Tactile Data-Sheet style)
 *   - Header with title and close button
 *   - Scroll if content is long
 * 
 * Technical notes:
 *   - Uses position fixed for overlay
 *   - High z-index to be above everything
 *   - closeOnOverlayClick allows closing by clicking outside
 * ============================================================
 */

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlayClick = true }) {
  // ============================================================
  // EFFECT: Close with ESC
  // Description: Closes modal when Escape is pressed
  // ============================================================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ============================================================
  // EFFECT: Block body scroll when open
  // ============================================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ============================================================
  // SIZE DEFINITIONS
  // ============================================================
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    /* ============================================================
        OVERLAY
        Semi-transparent dark background
        Click to close (configurable)
       ============================================================ */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      {/* ============================================================
          MODAL CONTAINER
          White background
          Scale animation
         ============================================================ */}
      <div 
        className={`w-full ${sizeClasses[size]} bg-white shadow-none relative`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* ============================================================
            MODAL HEADER
            Title + Close button
         ============================================================ */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-surface-container">
          <h2 className="font-sans font-bold text-lg uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-gray-500 hover:text-black transition-colors"
          >
            close
          </button>
        </div>

        {/* ============================================================
            MODAL CONTENT
            Scrollable content
         ============================================================ */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>

      {/* ============================================================
          ANIMATION STYLES (inline)
         ============================================================ */}
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}