import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Power, 
  Trash2,
  ChevronDown,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ListaUsuarios = ({ onEdit, onAdd }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'nombreUsuario', direccion: 'asc' });

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
      cargarUsuarios();
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

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleBusqueda = usuario.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                          usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleTipo = filtroTipo === 'TODOS' || usuario.tipoUsuario === filtroTipo;
    const cumpleEstado = filtroEstado === 'TODOS' || 
                        (filtroEstado === 'ACTIVO' && usuario.activo) ||
                        (filtroEstado === 'INACTIVO' && !usuario.activo);
    
    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

  // Ordenar usuarios
  const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => {
    const valorA = a[ordenamiento.campo];
    const valorB = b[ordenamiento.campo];
    
    if (ordenamiento.direccion === 'asc') {
      return valorA > valorB ? 1 : -1;
    } else {
      return valorA < valorB ? 1 : -1;
    }
  });

  const cambiarOrdenamiento = (campo) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  const tipoUsuarioConfig = {
    ADMIN: { color: 'purple', icon: Shield },
    PROFESOR: { color: 'blue', icon: User },
    ESTUDIANTE: { color: 'green', icon: User }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header con filtros */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>

          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg cursor-pointer"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Usuario
          </motion.button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtro por tipo */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="ADMIN">Administrador</option>
              <option value="PROFESOR">Profesor</option>
              <option value="ESTUDIANTE">Estudiante</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Filtro por estado */}
          <div className="relative">
            <Power className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-center text-sm text-gray-600">
            Mostrando {usuariosOrdenados.length} de {usuarios.length} usuarios
          </div>
        </div>
      </div>
      
      {/* Tabla mejorada */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                onClick={() => cambiarOrdenamiento('nombreUsuario')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Usuario</span>
                  {ordenamiento.campo === 'nombreUsuario' && (
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${ordenamiento.direccion === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
              </th>
              <th 
                onClick={() => cambiarOrdenamiento('tipoUsuario')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Tipo</span>
                  {ordenamiento.campo === 'tipoUsuario' && (
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${ordenamiento.direccion === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {usuariosOrdenados.map((usuario, index) => {
                const tipoConfig = tipoUsuarioConfig[usuario.tipoUsuario];
                const IconoTipo = tipoConfig.icon;
                
                return (
                  <motion.tr
                    key={usuario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-${tipoConfig.color}-400 to-${tipoConfig.color}-600 flex items-center justify-center text-white font-bold`}>
                            {usuario.nombreUsuario.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombreUsuario}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden">{usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${tipoConfig.color}-100 text-${tipoConfig.color}-800`}>
                        <IconoTipo className="w-3 h-3 mr-1" />
                        {usuario.tipoUsuario}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {usuario.activo ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            <span className="text-sm">Activo</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="w-5 h-5 mr-1" />
                            <span className="text-sm">Inactivo</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCambiarEstado(usuario.id)}
                          className={`p-2 ${usuario.activo ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'} rounded-lg transition-colors cursor-pointer`}
                          title={usuario.activo ? 'Desactivar' : 'Activar'}
                        >
                          <Power className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEliminar(usuario.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {usuariosOrdenados.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No se encontraron usuarios</p>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;