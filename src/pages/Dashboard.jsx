import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/incidences')
      .then(({ data }) => setIncidences(data.data || data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6]">
      <header className="bg-[#FAF8F5] border-b border-[#D4CFC2] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-serif text-[#2D4A44]">
          INCIDEN<span className="text-[#4A7C6F]">☆</span>ly
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6B6B6B]">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-[#4A7C6F] hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#3D3D3D]">My Incidences</h2>
          <button className="px-4 py-2 bg-[#4A7C6F] text-white rounded hover:bg-[#3D6257] transition-colors">
            + New Incidence
          </button>
        </div>

        {loading ? (
          <p className="text-[#6B6B6B]">Loading...</p>
        ) : incidences.length === 0 ? (
          <p className="text-[#6B6B6B]">No incidences yet.</p>
        ) : (
          <div className="bg-[#FAF8F5] border border-[#D4CFC2] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#E8E4DA]">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#3D3D3D]">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#3D3D3D]">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#3D3D3D]">Created</th>
                </tr>
              </thead>
              <tbody>
                {incidences.map((incidence) => (
                  <tr key={incidence.id} className="border-t border-[#D4CFC2]">
                    <td className="px-4 py-3 text-[#3D3D3D]">{incidence.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        incidence.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {incidence.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] text-sm">
                      {new Date(incidence.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}