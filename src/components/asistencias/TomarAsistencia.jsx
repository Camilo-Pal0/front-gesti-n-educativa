import { useState, useEffect } from 'react';
import { asistenciaService, grupoService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TomarAsistencia = ({ onBack }) => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [yaRegistrada, setYaRegistrada] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarGrupos();
  }, []);

  useEffect(() => {
    if (grupoSeleccionado && fecha) {
      verificarYCargarAsistencia();
    }
  }, [grupoSeleccionado, fecha]);

  const cargarGrupos = async () => {
    try {
      let data;
      if (user.tipoUsuario === 'PROFESOR') {
        data = await grupoService.obtenerPorProfesor(user.id);
      } else {
        data = await grupoService.obtenerActivos();
      }
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setError('Error al cargar los grupos');
    }
  };

  const verificarYCargarAsistencia = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar si ya se tomó asistencia
      const verificacion = await asistenciaService.verificarAsistencia(grupoSeleccionado, fecha);
      setYaRegistrada(verificacion.yaRegistrada);
      
      // Cargar lista de estudiantes
      const lista = await asistenciaService.obtenerListaAsistencia(grupoSeleccionado, fecha);
      setEstudiantes(lista);
    } catch (error) {
      console.error('Error al cargar asistencia:', error);
      setError('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = (estudianteId, nuevoEstado) => {
    setEstudiantes(prev => prev.map(est => 
      est.estudianteId === estudianteId 
        ? { ...est, estado: nuevoEstado }
        : est
    ));
  };

  const handleObservacionChange = (estudianteId, observacion) => {
    setEstudiantes(prev => prev.map(est => 
      est.estudianteId === estudianteId 
        ? { ...est, observaciones: observacion }
        : est
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!grupoSeleccionado) {
      setError('Debe seleccionar un grupo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const datos = {
        grupoId: parseInt(grupoSeleccionado),
        fecha: fecha,
        asistencias: estudiantes.map(est => ({
          estudianteId: est.estudianteId,
          estado: est.estado,
          observaciones: est.observaciones || ''
        }))
      };

      await asistenciaService.tomarAsistencia(datos);
      setSuccess('Asistencia registrada correctamente');
      setYaRegistrada(true);
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      setError(error.response?.data?.mensaje || 'Error al guardar la asistencia');
    } finally {
      setLoading(false);
    }
  };

  const estadoClases = {
    PRESENTE: 'bg-green-100 text-green-800 hover:bg-green-200',
    AUSENTE: 'bg-red-100 text-red-800 hover:bg-red-200',
    TARDANZA: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    JUSTIFICADO: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tomar Asistencia</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
          Volver
        </button>
      </div>

      {/* Selección de grupo y fecha */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Grupo
            </label>
            <select
              value={grupoSeleccionado}
              onChange={(e) => setGrupoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Seleccione un grupo --</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.codigo} - {grupo.materia} ({grupo.nombreGrupo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
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

      {yaRegistrada && !success && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded mb-4">
          Ya se ha registrado asistencia para este grupo en la fecha seleccionada.
        </div>
      )}

      {/* Lista de estudiantes */}
      {grupoSeleccionado && estudiantes.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Lista de Estudiantes ({estudiantes.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.estudianteId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {estudiante.estudianteNombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {estudiante.estudianteEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'].map(estado => (
                            <button
                              key={estado}
                              type="button"
                              onClick={() => handleEstadoChange(estudiante.estudianteId, estado)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                estudiante.estado === estado
                                  ? estadoClases[estado]
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {estado}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={estudiante.observaciones || ''}
                          onChange={(e) => handleObservacionChange(estudiante.estudianteId, e.target.value)}
                          placeholder="Observaciones..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || yaRegistrada}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? 'Guardando...' : 'Guardar Asistencia'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {grupoSeleccionado && estudiantes.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          No hay estudiantes inscritos en este grupo.
        </div>
      )}
    </div>
  );
};

export default TomarAsistencia;