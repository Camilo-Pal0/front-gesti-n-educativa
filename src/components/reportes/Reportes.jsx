import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

  // Colores para los gráficos
  const COLORS = {
    PRESENTE: '#10B981',
    AUSENTE: '#EF4444',
    TARDANZA: '#F59E0B',
    JUSTIFICADO: '#3B82F6'
  };

  if (loading) return <div className="text-center py-8">Cargando reportes...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!analisisGeneral) return <div className="text-center py-8">No hay datos disponibles</div>;

  // Preparar datos para el gráfico de pie
  const dataPie = Object.entries(analisisGeneral.estado_general || {}).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad
  }));

  // Preparar datos para el gráfico de líneas
  const dataTendencia = analisisGeneral.tendencia_diaria?.fechas?.map((fecha, index) => ({
    fecha: new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    Presente: analisisGeneral.tendencia_diaria.presente[index] || 0,
    Ausente: analisisGeneral.tendencia_diaria.ausente[index] || 0,
    Tardanza: analisisGeneral.tendencia_diaria.tardanza[index] || 0,
    Justificado: analisisGeneral.tendencia_diaria.justificado[index] || 0
  })) || [];

  // Preparar datos para el gráfico de barras
  const dataMateria = Object.entries(analisisGeneral.asistencia_por_materia || {}).map(([materia, porcentaje]) => ({
    materia: materia.length > 20 ? materia.substring(0, 20) + '...' : materia,
    porcentaje
  }));

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reportes y Análisis</h2>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribución General de Asistencias */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución General de Asistencias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Porcentaje de Asistencia por Materia */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Asistencia por Materia (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataMateria} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="materia" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="porcentaje" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tendencia de Asistencias (Últimos 30 días) */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencia de Asistencias - Últimos 30 días</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataTendencia} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Presente" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Ausente" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Tardanza" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="Justificado" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Estudiantes en Riesgo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-800">
            Estudiantes en Riesgo de Deserción ({estudiantesRiesgo.length})
          </h3>
          <p className="text-sm text-red-600 mt-1">Estudiantes con menos del 75% de asistencia en los últimos 30 días</p>
        </div>
        
        {estudiantesRiesgo.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ausencias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel de Riesgo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estudiantesRiesgo.map((estudiante) => (
                  <tr key={estudiante.estudiante_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {estudiante.nombre_usuario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estudiante.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {estudiante.porcentaje_asistencia}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {estudiante.ausencias} de {estudiante.total_clases}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${estudiante.nivel_riesgo === 'CRITICO' ? 'bg-red-100 text-red-800' :
                          estudiante.nivel_riesgo === 'ALTO' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {estudiante.nivel_riesgo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No hay estudiantes en riesgo de deserción
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;