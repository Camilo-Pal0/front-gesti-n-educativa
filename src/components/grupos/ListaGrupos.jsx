import { useState, useEffect } from 'react';
import { grupoService } from '../../services/api';

const ListaGrupos = ({ onEdit, onAdd, onManageStudents }) => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.obtenerTodos();
      setGrupos(data);
    } catch (error) {
      setError('Error al cargar grupos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id) => {
    try {
      await grupoService.cambiarEstado(id);
      cargarGrupos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Lista de Grupos</h3>
          <button
            onClick={onAdd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded text-sm"
          >
            Crear Grupo
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Materia
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesor(es)
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiantes
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grupos.map((grupo) => (
              <tr key={grupo.id}>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {grupo.codigo}
                  </div>
                  <div className="text-xs text-gray-500">{grupo.periodo}</div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <div className="text-sm text-gray-900">{grupo.materia}</div>
                  <div className="text-xs text-gray-500">
                    {grupo.facultad} - Sem {grupo.semestre}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {grupo.profesores && grupo.profesores.length > 0 ? (
                      grupo.profesores.map(p => p.nombreUsuario).join(', ')
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <div className="text-sm text-gray-900">{grupo.horario || 'Por definir'}</div>
                  <div className="text-xs text-gray-500">{grupo.aula || ''}</div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {grupo.estudiantesInscritos}/{grupo.cupoMaximo}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${grupo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {grupo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-lg">
                    <button
                      onClick={() => onEdit(grupo)}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={() => onManageStudents(grupo)}
                      className="text-green-600 hover:text-green-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      <i class="fa-solid fa-users"></i>
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(grupo.id)}
                      className="text-yellow-600 hover:text-yellow-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      {grupo.activo ? <i class="fas fa-toggle-off"></i>
                     : <i class="fas fa-toggle-on"></i>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaGrupos;