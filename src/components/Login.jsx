import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    nombreUsuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(credentials);
      console.log('Login result:', result);
      
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.tipoUsuario === 'ADMIN') {
          navigate('/admin');
        } else if (user.tipoUsuario === 'PROFESOR') {
          navigate('/profesor');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setError('Error de conexión con el servidor');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo y Título */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-[#ed217d] rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Formulario */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Campo Usuario */}
              <div className="relative">
                <label htmlFor="nombreUsuario" className="text-sm font-medium text-gray-700 block mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nombreUsuario"
                    name="nombreUsuario"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed217d] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Ingresa tu usuario"
                    value={credentials.nombreUsuario}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <label htmlFor="contrasena" className="text-sm font-medium text-gray-700 block mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="contrasena"
                    name="contrasena"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed217d] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Ingresa tu contraseña"
                    value={credentials.contrasena}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Login */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ed217d] hover:bg-[#e1005e] focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>
          </form>

          {/* Usuarios de Prueba */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Usuarios de prueba
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#ed217d] transition-colors cursor-pointer"
                onClick={() => setCredentials({ nombreUsuario: 'admin', contrasena: 'password123' })}>
                <p className="text-sm font-medium text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500 mt-1">admin / password123</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#ed217d] transition-colors cursor-pointer"
                onClick={() => setCredentials({ nombreUsuario: 'profesor1', contrasena: 'password123' })}>
                <p className="text-sm font-medium text-gray-900">Profesor</p>
                <p className="text-xs text-gray-500 mt-1">profesor1 / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Imagen/Gradiente */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Sistema de Gestión Educativa
              </h1>
              <p className="text-xl text-white/90">
                Gestiona tus cursos, estudiantes y asistencias de manera eficiente y moderna.
              </p>
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70 mt-1">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/70 mt-1">Profesores</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/70 mt-1">Asistencia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;