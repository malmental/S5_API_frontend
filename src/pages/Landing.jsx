/**
 * ============================================================
 * PAGE: Landing (Landing Page / Home)
 * ============================================================
 * Description: 
 *   Public entry page to the application. Functions as a
 *   "Landing Page" showing branding, system features
 *   and calls to action for login/register.
 * 
 * Location: src/pages/Landing.jsx
 * 
 * Routing:
 *   - Accessible from "/" (root route)
 *   - Redirects to /dashboard if user is already logged in
 *   - Links to /login and /register
 * 
 * Sections:
 *   1. Header - TopAppBar with logo and navigation
 *   2. Hero - Main welcome with CTA
 *   3. Features - Feature cards
 *   4. Technical Specs - Technical specifications
 *   5. Product Visual - Terminal visual section
 *   6. Footer - Footer
 * 
 * Technical notes:
 *   - Does not require authentication (public)
 *   - External links (RESOURCES, DOCS, STATUS) are placeholders
 *   - Terminal image is from Google CDN (could be localized)
 *   - Timestamp in specs updates on each render
 * ============================================================
 */

import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    /* ============================================================
        MAIN CONTAINER
        Layout: Flex column | Min-height: 100vh | Background: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECTION 1: HEADER / TOPAPPBAR
          Description: Fixed top navigation bar
          Elements: Logo, Status badge, Nav links, Login/Register CTAs
          Position: sticky top for scroll effect
       ============================================================ */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-mono font-bold text-xl border-black px-2 py-1">INCIDENsly 𝒘ebApp</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        
        {/* ============================================================
            SECTION 2: HERO SECTION
            Description: Main welcome area
            Layout: Grid 12 columns | Split 7/5
            Elements: Badge, Large title, Description, CTAs
            Background: stippled-bg (dot pattern)
        ============================================================ */}
        <section className="grid grid-cols-12 gap-0 border-b-2 border-black min-h-[716px]">
          
          {/* 2.1: LEFT SIDE - Main message */}
          <div className="col-span-12 md:col-span-7 p-8 md:p-16 flex flex-col justify-center border-r-0 md:border-r-2 border-black relative overflow-hidden">
            <div className="absolute inset-0 stippled-bg pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mb-4 inline-block">
                <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">INCIDENCE MANAGEMENT</span>
              </div>
              <h1 className="font-sans font-bold text-6xl md:text-8xl leading-none tracking-tighter mb-8">
                INCIDENsly 𝒘ebApp
              </h1>
              <p className="font-sans text-xl max-w-xl mb-12 text-on-surface-variant leading-relaxed">
                Professional incident management and tracking system.
                Organize, assign and resolve issues efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="bg-primary text-on-primary px-10 py-4 font-sans font-bold text-xl flex items-center gap-3 hover:bg-neutral-800 transition-colors">
                  SIGN IN
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link to="/register" className="bg-surface-container-high border border-black px-10 py-4 font-sans font-bold text-xl hover:bg-surface-variant transition-colors">
                  REGISTER
                </Link>
              </div>
            </div>
          </div>

          {/* 2.2: RIGHT SIDE - Features */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="p-8 border-b-2 border-black bg-white flex-grow">
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-label font-bold text-lg">FEATURES</h2>
                <span className="font-label text-xs">REF: 084-INC</span>
              </div>
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">folder_managed</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Incidence management</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">assignment_ind</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Priority assignment</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">priority_high</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Status classification</h3>
                    </div>
                  </div>
                </div>
                {/* Feature 4 */}
                <div className="border-1 border-black p-4 bg-surface">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-4xl">analytics</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm uppercase">Reports and statistics</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2.3: SPECS BOX - Technical specifications */}
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
            SECTION 3: PRODUCT VISUAL
            Description: Product demo visual section
            Style: Terminal aesthetic (black background, double border)
            NOTE: Background image from external CDN
        ============================================================ */}
        <section className="p-6 md:p-12 border-b-2 border-black bg-surface-container-low">
          <div className="border-2 border-black bg-black p-2">
            <div className="border border-white/20 aspect-video relative flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img alt="Terminal background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCELeUUNzQxeZ4i1fBsCwTcRfGSI6z3C8YC3E1NcNTKNGvsPfAA3p-x3e9qOKfIcIhsO5Pzv652gp3h563ubZapb9pawnGYQS2EeqCXxlw0RHn07RwDAjcgTOjJ83u13-87aNOCM9OzbUdTgEf631WU4cAg3QFjB-Y9rTuJGFjnLyLGHrd8t00FQau4Ix_5hNragXxvq77ZduMimARZJAEFwHJZ7CnoiIhjvCPQ1dFqYE1UQ8-gIDhK6hBFCvxoaN8aH54xvfRPTm8" />
              </div>
              <div className="z-10 text-center">
                <p className="font-label text-xs mb-4">Web application for incident management</p>
                <h2 className="font-sans font-bold text-3xl mb-2">INCIDENsly 𝒘ebApp</h2>
                <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
                <p className="font-label text-sm max-w-md mx-auto px-4">Assignment of incidences by status and urgency, creation of tags and comments for user interaction.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          SECTION 4: FOOTER
          Description: Footer with legal links
          Layout: Flex row (responsive) | Top border: 2px black
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