import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SideNavBar from '../components/layout/SideNavBar';
import IncidentsTable from '../components/dashboard/IncidentsTable';
import Modal from '../components/ui/Modal';
import IncidenceDetail from '../components/incidences/IncidenceDetail';
import { useMetrics } from '../hooks/useMetrics';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTag, setSearchTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const { stats: statsData, loading: statsLoading, fetchStats } = useMetrics();
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    
    let url = `/incidences?page=${currentPage}`;
    
    if (activeFilter) {
      if (activeFilter === 'critical') {
        url += '&priority=critical';
      } else if (activeFilter === 'high') {
        url += '&priority=high';
      } else {
        url += `&status=${activeFilter}`;
      }
    }
    
    if (searchTag.trim()) {
      url += `&search=${encodeURIComponent(searchTag.trim())}`;
    }
    
    api.get(url)
      .then(({ data }) => {
        const incidenceData = data.data || data;
        setIncidences(Array.isArray(incidenceData) ? incidenceData : []);
        if (data.meta) {
          setMeta(data.meta);
        }
      })
      .catch(err => {
        console.error('Error fetching incidences:', err);
        setIncidences([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage, activeFilter, searchTag]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRowClick = async (incidence) => {
    setLoadingDetail(true);
    setSelectedIncidence(incidence);
    setShowDetailModal(true);
    
    try {
      const { data } = await api.get(`/incidences/${incidence.id}`);
      setSelectedIncidence(data.data || data);
    } catch (err) {
      console.error('Error fetching incidence details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCommentAdded = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
  };

  const handleCommentDeleted = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SideNavBar />
      <main className="ml-64 pt-0 min-h-screen relative">
        <div className="absolute inset-0 stippled-bg"></div>
        <div className="relative p-8 max-w-6xl">
          <div className="mb-8">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">DASHBOARD MODULE</span>
            <h1 className="font-sans font-bold text-4xl mt-2">MAIN DASHBOARD</h1>
            <p className="font-label text-sm text-on-surface-variant mt-1">System incidents summary</p>
          </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
              <button
                onClick={() => setActiveFilter(activeFilter === 'high' ? null : 'high')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'high' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">High</div>
                <div className="text-5xl font-light mb-2">{statsData.high}</div>
                <div className="text-xs">High priority incidents</div>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'open' ? null : 'open')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'open' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">Open</div>
                <div className="text-5xl font-light mb-2">{statsData.open}</div>
                <div className="text-xs">Open incidents</div>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'in_progress' ? null : 'in_progress')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'in_progress' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">In Progress</div>
                <div className="text-5xl font-light mb-2">{statsData.inProgress}</div>
                <div className="text-xs">In progress incidents</div>
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'closed' ? null : 'closed')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'closed' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">Closed</div>
                <div className="text-5xl font-light mb-2">{statsData.closed}</div>
                <div className="text-xs">Closed incidents</div>
              </button>
            </div>
          <div className="mb-6 bg-white p-4">
            <div className="flex gap-4 items-center">
              <input 
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="border-2 border-black p-2 text-xs flex-1" 
                placeholder="Search by hashtag..."
              />
              <button className="px-16 py-2 bg-primary text-white text-xs uppercase hover:bg-neutral-800 transition-colors">
                Search
              </button>
            </div>
          </div>

          <IncidentsTable 
            incidences={incidences} 
            loading={loading}
            onRowClick={handleRowClick}
            currentPage={currentPage}
            totalPages={meta.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="INCIDENCE DETAILS"
        size="lg"
      >
        <IncidenceDetail
          incidence={selectedIncidence}
          onEdit={() => navigate('/my-incidences')}
          onDelete={() => alert('Para eliminar incidencias, use la página "My Incidences"')}
          onClose={() => setShowDetailModal(false)}
          showCommentForm={true}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </Modal>
    </div>
  );
}