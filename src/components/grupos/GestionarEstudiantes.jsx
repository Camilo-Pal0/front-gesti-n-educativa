import { useState, useEffect } from 'react';
import { grupoService } from '../../services/api';

const GestionarEstudiantes = ({ grupo, onBack }) => {
  const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [grupo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [inscritos, disponibles] = await Promise.all([
        grupoService.obtenerEstudiantesDelGrupo(grupo.id),
        grupoService.obtenerEstudiantesDisponibles(grupo.id)
      ]);
      setEstudiantesInscritos(inscritos);
      setEstudiantesDisponibles(disponibles);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleInscribir = async (estudianteId) => {
    try {
      setError('');
      setSuccess('');
      await grupoService.inscribirEstudiante(grupo.id, estudianteId);
      setSuccess('Estudiante inscrito correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      setError(error.response?.data?.mensaje || 'Error al inscribir estudiante');
    }
  };

  const handleDesinscribir = async (estudianteId) => {
    if (window.confirm('¿Está seguro de desinscribir este estudiante?')) {
      try {
        setError('');
        setSuccess('');
        await grupoService.desinscribirEstudiante(grupo.id, estudianteId);
        setSuccess('Estudiante desinscrito correctamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al desinscribir estudiante:', error);
        setError(error.response?.data?.mensaje || 'Error al desinscribir estudiante');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Gestionar Estudiantes - {grupo.codigo}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {grupo.materia} | Cupo: {estudiantesInscritos.length}/{grupo.cupoMaximo}
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
          Volver
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estudiantes Disponibles */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Estudiantes Disponibles ({estudiantesDisponibles.length})
          </h4>
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {estudiantesDisponibles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay estudiantes disponibles
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {estudiantesDisponibles.map((estudiante) => (
                  <div key={estudiante.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {estudiante.nombreUsuario}
                      </p>
                      <p className="text-xs text-gray-500">{estudiante.email}</p>
                    </div>
                    <button
                      onClick={() => handleInscribir(estudiante.id)}
                      disabled={estudiantesInscritos.length >= grupo.cupoMaximo}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Inscribir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estudiantes Inscritos */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Estudiantes Inscritos ({estudiantesInscritos.length})
          </h4>
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {estudiantesInscritos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay estudiantes inscritos
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {estudiantesInscritos.map((estudiante) => (
                  <div key={estudiante.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {estudiante.nombreUsuario}
                      </p>
                      <p className="text-xs text-gray-500">{estudiante.email}</p>
                    </div>
                    <button
                      onClick={() => handleDesinscribir(estudiante.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition-all duration-300"
                    >
                      Desinscribir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información del cupo */}
      {estudiantesInscritos.length >= grupo.cupoMaximo && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          Este grupo ha alcanzado su cupo máximo
        </div>
      )}
    </div>
  );
};

export default GestionarEstudiantes;