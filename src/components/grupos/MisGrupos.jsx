import { useState, useEffect } from 'react';
import { grupoService, asistenciaService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MisGrupos = ({ onTomarAsistencia }) => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asistenciasHoy, setAsistenciasHoy] = useState({});

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.obtenerPorProfesor(user.id);
      setGrupos(data);
      
      // Verificar asistencias de hoy para cada grupo
      const fechaHoy = new Date().toISOString().split('T')[0];
      const asistencias = {};
      
      for (const grupo of data) {
        try {
          const verificacion = await asistenciaService.verificarAsistencia(grupo.id, fechaHoy);
          asistencias[grupo.id] = verificacion.yaRegistrada;
        } catch {
          asistencias[grupo.id] = false;
        }
      }
      
      setAsistenciasHoy(asistencias);
    } catch {
      console.error('Error al cargar grupos');
      setError('Error al cargar tus grupos');
    } finally {
      setLoading(false);
    }
  };

  const getDiaSemana = () => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[new Date().getDay()];
  };

  const handleTomarAsistencia = (grupo) => {
    if (onTomarAsistencia) {
      onTomarAsistencia(grupo);
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Grupos</h2>
        <p className="text-gray-600 mt-1">
          {getDiaSemana()}, {new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>

      {grupos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No tienes grupos asignados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grupos.map((grupo) => (
            <div 
              key={grupo.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-blue-300 to-blue-500 text-white p-4 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{grupo.codigo}</h3>
                    <p className="text-sm opacity-90">{grupo.nombreGrupo}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    asistenciasHoy[grupo.id] 
                      ? 'bg-green-300 text-green-900' 
                      : 'bg-yellow-300 text-yellow-900'
                  }`}>
                    {asistenciasHoy[grupo.id] ? '✓ Asistencia tomada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">{grupo.materia}</h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{grupo.horario || 'Horario no definido'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{grupo.aula || 'Aula no asignada'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{grupo.estudiantesInscritos || 0} estudiantes</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{grupo.creditos} créditos</span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Periodo: {grupo.periodo}</span>
                    <span className="text-gray-500">Semestre {grupo.semestre}</span>
                  </div>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => handleTomarAsistencia(grupo)}
                  disabled={asistenciasHoy[grupo.id]}
                  className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                    asistenciasHoy[grupo.id]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105'
                  }`}
                >
                  {asistenciasHoy[grupo.id] ? 'Asistencia Completada' : 'Tomar Asistencia'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisGrupos;