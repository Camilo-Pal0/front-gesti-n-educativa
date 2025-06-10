import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  Calendar, 
  BookOpen,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analisisGeneral, setAnalisisGeneral] = useState(null);
  const [estudiantesRiesgo, setEstudiantesRiesgo] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [general, riesgo] = await Promise.all([
        analyticsService.obtenerAnalisisGeneral(),
        analyticsService.obtenerPrediccionDesercion()
      ]);
      
      setAnalisisGeneral(general);
      setEstudiantesRiesgo(riesgo.estudiantes_en_riesgo || []);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      setError('Error al cargar los reportes. Verifica que el servicio de analytics esté activo.');
    } finally {
      setLoading(false);
    }
  };

  // Colores modernos con gradientes
  const COLORS = {
    PRESENTE: '#10B981',
    AUSENTE: '#EF4444',
    TARDANZA: '#F59E0B',
    JUSTIFICADO: '#8B5CF6'
  };

  const GRADIENT_COLORS = {
    PRESENTE: ['#10B981', '#059669'],
    AUSENTE: ['#EF4444', '#DC2626'],
    TARDANZA: ['#F59E0B', '#D97706'],
    JUSTIFICADO: ['#8B5CF6', '#7C3AED']
  };

  // Preparar datos para gráficos
  const dataPie = analisisGeneral ? Object.entries(analisisGeneral.estado_general || {}).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad
  })) : [];

  const dataTendencia = analisisGeneral?.tendencia_diaria?.fechas?.map((fecha, index) => ({
    fecha: new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    Presente: analisisGeneral.tendencia_diaria.presente[index] || 0,
    Ausente: analisisGeneral.tendencia_diaria.ausente[index] || 0,
    Tardanza: analisisGeneral.tendencia_diaria.tardanza[index] || 0,
    Justificado: analisisGeneral.tendencia_diaria.justificado[index] || 0
  })) || [];

  const dataMateria = analisisGeneral ? Object.entries(analisisGeneral.asistencia_por_materia || {}).map(([materia, porcentaje]) => ({
    materia: materia.length > 15 ? materia.substring(0, 15) + '...' : materia,
    porcentaje,
    fill: porcentaje >= 90 ? '#10B981' : porcentaje >= 80 ? '#F59E0B' : '#EF4444'
  })) : [];

  // Calcular estadísticas
  const totalEstudiantes = analisisGeneral ? Object.values(analisisGeneral.estado_general || {}).reduce((a, b) => a + b, 0) : 0;
  const porcentajeAsistencia = analisisGeneral && totalEstudiantes > 0 ? 
    Math.round((analisisGeneral.estado_general.PRESENTE / totalEstudiantes) * 100) : 0;
  const tendenciaAsistencia = dataTendencia.length > 1 ? 
    dataTendencia[dataTendencia.length - 1].Presente - dataTendencia[dataTendencia.length - 2].Presente : 0;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, gradiente, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${gradiente} rounded-2xl p-6 text-white shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-2">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-center space-y-2">
          <motion.div 
            className="bg-white/20 rounded-full p-3"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          {trend !== undefined && (
            <motion.div 
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                trend > 0 ? 'bg-white/20 text-white' : 
                trend < 0 ? 'bg-white/20 text-white' : 
                'bg-white/10 text-white/70'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span className="text-xs font-medium">{Math.abs(trend)}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatter ? formatter(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"
          whileRotate={{ rotate: 360 }}
        />
        <p className="text-lg font-medium text-gray-700">Cargando dashboard...</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div 
        className="text-center space-y-4 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-red-600">{error}</p>
          <motion.button 
            onClick={cargarDatos}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  if (!analisisGeneral) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-lg font-medium text-gray-700">No hay datos disponibles</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard de Analytics
          </h1>
          <p className="text-gray-600 text-lg">Análisis completo del rendimiento estudiantil</p>
        </motion.div>

        {/* Stats Cards con mejor iconografía */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Asistencias"
            value={totalEstudiantes.toLocaleString()}
            subtitle="Registradas en el sistema"
            gradiente="from-indigo-500 to-indigo-600"
            delay={0.1}
          />
          <StatCard
            icon={UserCheck}
            title="Asistencia General"
            value={`${porcentajeAsistencia}%`}
            subtitle="Promedio de asistencia"
            trend={tendenciaAsistencia}
            gradiente="from-green-500 to-green-600"
            delay={0.2}
          />
          <StatCard
            icon={UserX}
            title="En Riesgo"
            value={estudiantesRiesgo.length}
            subtitle="Estudiantes con bajo rendimiento"
            gradiente="from-red-500 to-red-600"
            delay={0.3}
          />
          <StatCard
            icon={BookOpen}
            title="Materias Activas"
            value={analisisGeneral ? Object.keys(analisisGeneral.asistencia_por_materia || {}).length : 0}
            subtitle="Cursos en seguimiento"
            gradiente="from-teal-500 to-teal-600"
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Distribución de Asistencias */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Distribución de Asistencias</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  {Object.entries(GRADIENT_COLORS).map(([key, colors]) => (
                    <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[0]} />
                      <stop offset="100%" stopColor={colors[1]} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${entry.name})`}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="rect"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Asistencia por Materia */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Asistencia por Materia</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataMateria} margin={{ left: 20, right: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="materia" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip formatter={(value) => `${value}%`} />} />
                <Bar 
                  dataKey="porcentaje" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tendencia Temporal */}
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tendencia de Asistencias - Últimos 30 días</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dataTendencia} margin={{ left: 20, right: 20 }}>
              <defs>
                <linearGradient id="presenteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="ausenteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="Presente" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="Ausente" stroke="#EF4444" strokeWidth={3} />
              <Line type="monotone" dataKey="Tardanza" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="Justificado" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Estudiantes en Riesgo */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-red-500 to-rose-500 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Estudiantes en Riesgo de Deserción ({estudiantesRiesgo.length})
                </h3>
                <p className="text-red-100 mt-1">Estudiantes con menos del 75% de asistencia</p>
              </div>
            </div>
          </div>
          
          {estudiantesRiesgo.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Estudiante</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Asistencia</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Ausencias</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Nivel de Riesgo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {estudiantesRiesgo.map((estudiante, index) => (
                    <motion.tr 
                      key={estudiante.estudiante_id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#e82b7b] rounded-full flex items-center justify-center text-white font-semibold">
                            {estudiante.nombre_usuario.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{estudiante.nombre_usuario}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-gray-600">{estudiante.email}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                estudiante.porcentaje_asistencia >= 80 ? 'bg-green-500' :
                                estudiante.porcentaje_asistencia >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${estudiante.porcentaje_asistencia}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">{estudiante.porcentaje_asistencia}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-gray-900 font-medium">
                        {estudiante.ausencias} de {estudiante.total_clases}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                          estudiante.nivel_riesgo === 'CRITICO' ? 'bg-red-100 text-red-800' :
                          estudiante.nivel_riesgo === 'ALTO' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {estudiante.nivel_riesgo}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¡Excelente!</h4>
              <p className="text-gray-600">No hay estudiantes en riesgo de deserción</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reportes;