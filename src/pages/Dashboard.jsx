import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import Footer from '../components/layout/Footer';
import QuickStats from '../components/dashboard/QuickStats';
import IncidentsTable from '../components/dashboard/IncidentsTable';
import CreateIncidentFAB from '../components/dashboard/CreateIncidentFAB';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/incidences')
      .then(({ data }) => setIncidences(data.data || data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCreateIncident = () => {
    console.log('Create new incident');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* ============================================
          SECCIÓN 1: TOP NAVIGATION BAR (Header fijo)
          Descripción: Barra de navegación superior con logo, menú de navegación principal, estado del sistema y perfil de usuario
          Componente: src/components/layout/TopNavBar.jsx
          ============================================ */}
      <TopNavBar user={user} onLogout={handleLogout} />
      
      {/* ============================================
          SECCIÓN 2: SIDEBAR NAVIGATION (Menú lateral)
          Descripción: Barra lateral fija con menú de operaciones (Dashboard, Incidents, Reports, Logs)
          Componente: src/components/layout/SideNavBar.jsx
          ============================================ */}
      <SideNavBar />
      
      {/* ============================================
          SECCIÓN 3: MAIN CONTENT AREA (Área principal)
          Descripción: Contenedor principal con márgenes para el sidebar
          ============================================ */}
      <main className="ml-64 pt-14 min-h-screen bg-surface">
        <div className="p-8 max-w-6xl">
          
          {/* ============================================
              SECCIÓN 3.1: PAGE HEADER (Encabezado de página)
              Descripción: Título principal de la página con ID de sesión y timestamp de última sincronización
              ============================================ */}
          <header className="mb-10 flex justify-between items-end border-b-4 border-primary pb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter font-sans uppercase">Incident Overview</h1>
              <p className="font-mono text-sm text-gray-600 mt-2">ACTIVE_SESSION_ID: {user?.id || '---'}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase text-gray-500">Last Synced</p>
              <p className="font-mono text-lg font-bold">{new Date().toISOString().slice(0, 19).replace('T', ' // ')}</p>
            </div>
          </header>

          {/* ============================================
              SECCIÓN 3.2: QUICK STATS (Estadísticas rápidas)
              Descripción: Grid de 4 tarjetas con métricas clave: Total Activas, Alta Prioridad, Resolución Promedio, Nodos Online
              Componente: src/components/dashboard/QuickStats.jsx
              NOTA: "Nodes Online" es un valor estático de ejemplo - necesita integración con API real
              ============================================ */}
          <QuickStats incidences={incidences} />

          {/* ============================================
              SECCIÓN 3.3: INCIDENTS TABLE (Tabla de incidencias)
              Descripción: Tabla con buscador, filtrado en tiempo real, estados visuales y paginación
              Componente: src/components/dashboard/IncidentsTable.jsx
              ============================================ */}
          <IncidentsTable incidences={incidences} loading={loading} />

          {/* ============================================
              SECCIÓN 3.4: TECHNICAL DETAILS (Detalles técnicos)
              Descripción: Panel de logs del sistema y información adicional del usuario
              NOTA: Esta sección puede eliminarse si se prefiere un diseño más limpio
              ============================================ */}
          <div className="mt-12 flex gap-8">
            
            {/* Sub-sección 3.4.1: SYSTEM LOGS (Logs del sistema) */}
            <div className="w-2/3 border-2 border-black p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 stippled-bg pointer-events-none"></div>
              <h3 className="font-sans font-black text-xl mb-4">SYSTEM_LOG_EXTRACT: RECENT</h3>
              <div className="bg-surface-container-high p-4 border border-gray-400">
                <code className="font-mono text-xs leading-relaxed text-gray-700">
                  [{new Date().toISOString().slice(11, 19)}] SYSTEM: All services operational<br/>
                  [{new Date().toISOString().slice(11, 19)}] DATABASE: Connection pool active<br/>
                  [{new Date().toISOString().slice(11, 19)}] AUTH: Token validation successful<br/>
                  [{new Date().toISOString().slice(11, 19)}] API: All endpoints responsive
                </code>
              </div>
              <div className="mt-4 flex gap-4">
                <button className="border-2 border-black px-6 py-2 font-sans font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors">Refresh Logs</button>
                <button className="border-2 border-gray-400 px-6 py-2 font-sans font-bold text-xs uppercase text-gray-500 hover:bg-gray-100 transition-colors">Export Trace</button>
              </div>
            </div>
            
            {/* Sub-sección 3.4.2: SIDEBAR INFO (Información adicional) */}
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex-grow border-2 border-gray-300 p-4 bg-surface-container-low grayscale opacity-70">
                <p className="font-mono text-[10px] mb-2">NETWORK_TOPOLOGY_MAP</p>
                <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-gray-400">hub</span>
                </div>
              </div>
              <div className="border-2 border-black p-4 bg-surface">
                <p className="font-mono text-[10px] uppercase font-bold mb-1">Current User</p>
                <p className="font-sans font-bold text-sm">{user?.name || 'Guest User'}</p>
                <p className="font-mono text-xs text-gray-500 mt-1">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================
          SECCIÓN 4: FOOTER (Pie de página)
          Descripción: Footer fijo con versión de la aplicación y timestamp
          Componente: src/components/layout/Footer.jsx
          ============================================ */}
      <Footer />

      {/* ============================================
          SECCIÓN 5: FAB (Floating Action Button)
          Descripción: Botón flotante para crear nueva incidencia
          Componente: src/components/dashboard/CreateIncidentFAB.jsx
          ============================================ */}
      <CreateIncidentFAB onClick={handleCreateIncident} />
    </div>
  );
}