import { useState, useEffect } from 'react';
import { grupoService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus,
  Edit, 
  Power, 
  Users,
  ChevronDown,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ListaGrupos = ({ onEdit, onAdd, onManageStudents }) => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'codigo', direccion: 'asc' });

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

  // Obtener periodos únicos
  const periodosUnicos = [...new Set(grupos.map(g => g.periodo))].filter(Boolean);

  // Filtrar grupos
  const gruposFiltrados = grupos.filter(grupo => {
    const cumpleBusqueda = grupo.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          grupo.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
                          (grupo.facultad && grupo.facultad.toLowerCase().includes(busqueda.toLowerCase()));
    const cumplePeriodo = filtroPeriodo === 'TODOS' || grupo.periodo === filtroPeriodo;
    const cumpleEstado = filtroEstado === 'TODOS' || 
                        (filtroEstado === 'ACTIVO' && grupo.activo) ||
                        (filtroEstado === 'INACTIVO' && !grupo.activo);
    
    return cumpleBusqueda && cumplePeriodo && cumpleEstado;
  });

  // Ordenar grupos
  const gruposOrdenados = [...gruposFiltrados].sort((a, b) => {
    const valorA = a[ordenamiento.campo] || '';
    const valorB = b[ordenamiento.campo] || '';
    
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

  const getOcupacionColor = (estudiantes, cupo) => {
    const porcentaje = (estudiantes / cupo) * 100;
    if (porcentaje >= 90) return 'red';
    if (porcentaje >= 70) return 'amber';
    return 'green';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header con filtros */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h3>
            <p className="text-gray-600 mt-1">Administra los grupos y cursos del sistema</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Grupo
          </motion.button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código o materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtro por periodo */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
            >
              <option value="TODOS">Todos los periodos</option>
              {periodosUnicos.map(periodo => (
                <option key={periodo} value={periodo}>{periodo}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Filtro por estado */}
          <div className="relative">
            <Power className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-center text-sm text-gray-600">
            Mostrando {gruposOrdenados.length} de {grupos.length} grupos
          </div>
        </div>
      </div>
      
      {/* Tabla mejorada */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                onClick={() => cambiarOrdenamiento('codigo')}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Código / Materia</span>
                  {ordenamiento.campo === 'codigo' && (
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${ordenamiento.direccion === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                <div className="flex items-center space-x-1">
                  <UserCheck className="w-4 h-4" />
                  <span>Profesor(es)</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Horario</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Estudiantes</span>
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
              {gruposOrdenados.map((grupo, index) => {
                const ocupacionColor = getOcupacionColor(grupo.estudiantesInscritos || 0, grupo.cupoMaximo || 30);
                
                return (
                  <motion.tr
                    key={grupo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                            {grupo.codigo.substring(0, 3)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {grupo.codigo} - {grupo.nombreGrupo}
                            </div>
                            <div className="text-sm text-gray-600">
                              {grupo.materia}
                            </div>
                            <div className="text-xs text-gray-500">
                              {grupo.facultad} • Semestre {grupo.semestre} • {grupo.creditos} créditos
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="text-sm">
                        {grupo.profesores && grupo.profesores.length > 0 ? (
                          <div className="space-y-1">
                            {grupo.profesores.map(p => (
                              <div key={p.id} className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium mr-2">
                                  {p.nombreUsuario.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700">{p.nombreUsuario}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin asignar</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {grupo.horario || 'Por definir'}
                        </div>
                        {grupo.aula && (
                          <div className="flex items-center text-gray-500 text-xs mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {grupo.aula}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            {grupo.estudiantesInscritos || 0} / {grupo.cupoMaximo || 30}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`bg-${ocupacionColor}-500 h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${Math.min(((grupo.estudiantesInscritos || 0) / (grupo.cupoMaximo || 30)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        {((grupo.estudiantesInscritos || 0) >= (grupo.cupoMaximo || 30)) && (
                          <AlertCircle className="w-5 h-5 text-red-500 ml-2" title="Grupo lleno" />
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="flex items-center">
                        {grupo.activo ? (
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(grupo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onManageStudents(grupo)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Gestionar Estudiantes"
                        >
                          <Users className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCambiarEstado(grupo.id)}
                          className={`p-2 ${grupo.activo ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
                          title={grupo.activo ? 'Desactivar' : 'Activar'}
                        >
                          <Power className="w-5 h-5" />
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
      {gruposOrdenados.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No se encontraron grupos</p>
        </div>
      )}
    </div>
  );
};

export default ListaGrupos;