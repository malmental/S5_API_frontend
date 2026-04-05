/**
 * ============================================================
 * COMPONENTE: Modal (Ventana Flotante)
 * ============================================================
 * Descripción: 
 *   Componente reutilizable de modal para ventanas flotantes.
 *   Se usa para crear/editar incidencias y ver detalles.
 * 
 * Ubicación: src/components/ui/Modal.jsx
 * 
 * Props:
 *   - isOpen: Booleano que controla visibilidad
 *   - onClose: Función para cerrar el modal
 *   - title: Título del modal
 *   - children: Contenido del modal
 *   - size: Tamaño ('sm', 'md', 'lg')
 * 
 * Características:
 *   - Fondo overlay con click para cerrar
 *   - Animación de entrada/salida
 *   - Diseño con bordes negros (estilo Tactile Data-Sheet)
 *   - Header con título y botón de cerrar
 *   - Scroll si el contenido es largo
 * 
 * Notas técnicas:
 *   - Usa position fixed para overlayer
 *   - z-index alto para estar sobre todo
 *   - El closeOnOverlayClick permite cerrar al hacer click fuera
 * ============================================================
 */

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlayClick = true }) {
  // ============================================================
  // EFECTO: Cerrar con ESC
  // Descripción: Cierra el modal al presionar Escape
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
  // EFECTO: Bloquear scroll del body cuando está abierto
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
  // DEFINICIÓN DE TAMAÑOS
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
        Fondo oscuro semitransparente
        Click para cerrar (configurable)
       ============================================================ */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      {/* ============================================================
          MODAL CONTAINER
          Fondo blanco
          Animación de escala
         ============================================================ */}
      <div 
        className={`w-full ${sizeClasses[size]} bg-white shadow-none relative`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* ============================================================
            MODAL HEADER
            Título + Botón de cerrar
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
            Contenido scrolleable
         ============================================================ */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>

      {/* ============================================================
          ESTILOS DE ANIMACIÓN (inline)
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