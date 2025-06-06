import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/api';

const ListaUsuarios = ({ onEdit, onAdd }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.obtenerTodos();
      setUsuarios(data);
    } catch (error) {
      setError('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id) => {
    try {
      await usuarioService.cambiarEstado(id);
      cargarUsuarios(); // Recargar la lista
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de desactivar este usuario?')) {
      try {
        await usuarioService.eliminar(id);
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Lista de Usuarios</h3>
          <button
            onClick={onAdd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded text-sm"
          >
            Agregar Usuario
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.nombreUsuario}
                  </div>
                  <div className="text-sm text-gray-500 sm:hidden">{usuario.email}</div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${usuario.tipoUsuario === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                      usuario.tipoUsuario === 'PROFESOR' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {usuario.tipoUsuario}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3  text-lg">
                    <button
                      onClick={() => onEdit(usuario)}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={() => handleCambiarEstado(usuario.id)}
                      className="text-yellow-600 hover:text-yellow-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      {usuario.activo ? <i class="fas fa-toggle-off"></i>
                     : <i class="fas fa-toggle-on"></i>}
                    </button>
                    <button
                      onClick={() => handleEliminar(usuario.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                      <i class="fa-solid fa-trash-can"></i>
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

export default ListaUsuarios;