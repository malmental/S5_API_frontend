/**
 * ============================================================
 * PÁGINA: Landing (Página de Aterrizaje / Home)
 * ============================================================
 * Descripción: 
 *   Página pública de entrada a la aplicación. Cumple la función de
 *   "Landing Page" mostrando el branding, características del sistema
 *   y llamadas a la acción para login/register.
 * 
 * Ubicación: src/pages/Landing.jsx
 * 
 * Routing:
 *   - Accesible desde "/" (ruta raíz)
 *   - Redirige a /dashboard si el usuario ya está logueado
 *   - Links a /login y /register
 * 
 * Secciones:
 *   1. Header - TopAppBar con logo y navegación
 *   2. Hero - Bienvenida principal con CTA
 *   3. Features - Tarjetas de características
 *   4. Technical Specs - Especificaciones técnicas
 *   5. Product Visual - Sección visualterminal
 *   6. Footer - Pie de página
 * 
 * Notas técnicas:
 *   - No requiere autenticación (pública)
 *   - Los enlaces externos (RESOURCES, DOCS, STATUS) son placeholders
 *   - La imagen del terminal es de Google CDN (podría localizarse)
 *   - Timestamp en specs se actualiza en cada render
 * ============================================================
 */

import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    /* ============================================================
        CONTENEDOR PRINCIPAL
        Layout: Flex column | Min-height: 100vh | Fondo: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECCIÓN 1: HEADER / TOPAPPBAR
          Descripción: Barra de navegación superior fija
          Elementos: Logo, Status badge, Nav links, Login/Register CTAs
          Posición: sticky top para efecto de scroll
       ============================================================ */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENsly 𝒘ebApp</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        
        {/* ============================================================
            SECCIÓN 2: HERO SECTION
            Descripción: Área principal de bienvenida
            Layout: Grid 12 columnas | Dividido 7/5
            Elementos: Badge, Título grande, Descripción, CTAs
            Fondo: stippled-bg (patrón de puntos)
        ============================================================ */}
        <section className="grid grid-cols-12 gap-0 border-b-2 border-black min-h-[716px]">
          
          {/* 2.1: LADO IZQUIERDO - Mensaje principal */}
          <div className="col-span-12 md:col-span-7 p-8 md:p-16 flex flex-col justify-center border-r-0 md:border-r-2 border-black relative overflow-hidden">
            <div className="absolute inset-0 stippled-bg pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mb-4 inline-block">
                <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">GESTIÓN DE INCIDENCIAS</span>
              </div>
              <h1 className="font-sans font-bold text-6xl md:text-8xl leading-none tracking-tighter mb-8">
                INCIDENsly 𝒘ebApp
              </h1>
              <p className="font-sans text-xl max-w-xl mb-12 text-on-surface-variant leading-relaxed">
                Sistema profesional de gestión y seguimiento de incidencias.
                Organiza, asigna y resuelve problemas de manera eficiente.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="bg-primary text-on-primary px-10 py-4 font-sans font-bold text-xl flex items-center gap-3 hover:bg-neutral-800 transition-colors">
                  INICIAR SESIÓN
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link to="/register" className="bg-surface-container-high border border-black px-10 py-4 font-sans font-bold text-xl hover:bg-surface-variant transition-colors">
                  REGISTRARSE
                </Link>
              </div>
            </div>
          </div>

          {/* 2.2: LADO DERECHO - Características */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="p-8 border-b-2 border-black bg-white flex-grow">
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-label font-bold text-lg">CARACTERÍSTICAS</h2>
                <span className="font-label text-xs">REF: 084-INC</span>
              </div>
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">folder_managed</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Gestión para las incidencias</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">assignment_ind</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Asignación por prioridad</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">priority_high</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Clasificacion por estado</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 4 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">analytics</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Reportes y estadísticas</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2.3: SPECS BOX - Especificaciones técnicas */}
            <div className="p-8 bg-surface-container flex-grow flex flex-col justify-end">
              <div className="font-label text-[10px] leading-tight opacity-70">
                <p>SYSTEM LOAD: OPTIMAL</p>
                <p>LATENCY: 12ms</p>
                <p>ENCRYPTION: AES-256-BIT</p>
                <p>TIMESTAMP: {new Date().toISOString().slice(0, 19).replace('T', '_')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECCIÓN 3: PRODUCT VISUAL
            Descripción: Sección visual de demostración del producto
            Estilo: Terminal aesthetic (fondo negro, borde doble)
            NOTA: Imagen de fondo desde CDN externo
        ============================================================ */}
        <section className="p-6 md:p-12 border-b-2 border-black bg-surface-container-low">
          <div className="border-2 border-black bg-black p-2">
            <div className="border border-white/20 aspect-video relative flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img alt="Terminal background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCELeUUNzQxeZ4i1fBsCwTcRfGSI6z3C8YC3E1NcNTKNGvsPfAA3p-x3e9qOKfIcIhsO5Pzv652gp3h563ubZapb9pawnGYQS2EeqCXxlw0RHn07RwDAjcgTOjJ83u13-87aNOCM9OzbUdTgEf631WU4cAg3QFjB-Y9rTuJGFjnLyLGHrd8t00FQau4Ix_5hNragXxvq77ZduMimARZJAEFwHJZ7CnoiIhjvCPQ1dFqYE1UQ8-gIDhK6hBFCvxoaN8aH54xvfRPTm8" />
              </div>
              <div className="z-10 text-center">
                <p className="font-label text-xs mb-4">Aplicacion web para la gestion de incidencias</p>
                <h2 className="font-sans font-bold text-3xl mb-2">INCIDENsly 𝒘ebApp</h2>
                <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
                <p className="font-label text-sm max-w-md mx-auto px-4">Asignacion de incidencias por estado y urgencia, creacion de tags y comentarios para interacción entre usuarios.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          SECCIÓN 4: FOOTER
          Descripción: Pie de página con links legales
          Layout: Flex row (responsive) | Borde superior: 2px black
      ============================================================ */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-6 py-8 w-full bg-surface-container">
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