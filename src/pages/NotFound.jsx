import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 stippled-bg"></div>
      
      <div className="relative w-full max-w-md">
        {/* Tarjeta blanca con bordes negros */}
        <div className="bg-white">
          {/* Barra de título */}
          <div className="px-6 py-4 border-b-2 border-black bg-surface-dim">
            <h1 className="text-lg font-semibold uppercase tracking-tight">Error 404</h1>
          </div>

          {/* SVG, código 404 y mensaje */}
          <div className="p-6 text-center">
            {/* SVG de alerta animado */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 text-red-600">
              <title>alert-square-twotone</title>
              <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path fill="currentColor" fillOpacity="0" strokeDasharray="66" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.44 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                  <animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.15s" to=".3" />
                </path>
                <g fill="none">
                  <path strokeDasharray="8" strokeDashoffset="8" d="M12 7v6">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0" />
                  </path>
                  <path strokeDasharray="4" strokeDashoffset="4" d="M12 17v0.01">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0" />
                  </path>
                </g>
              </g>
            </svg>

            {/* Código numérico del error */}
            <div className="text-6xl font-bold mb-4">404</div>

            {/* Mensaje descriptivo */}
            <p className="text-gray-700 mb-6">La página que buscas no existe o ha sido movida.</p>
          </div>
        </div>
        
        {/* Botón volver al inicio */}
        <div className="px-6 py-4 border-t-2 border-black bg-surface-dim text-center">
          <Link to="/" className="inline-block px-6 py-3 border-2 border-black bg-black text-white text-sm uppercase hover:bg-gray-800 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
