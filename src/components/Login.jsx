import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
/* import zapatoAmarillo from '../assets/zapato-amarillo.png'; // Usa la ruta correcta para tu imagen */

const Login = () => {
  const [credentials, setCredentials] = useState({
    nombreUsuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      setError('Error de conexión con el servidor');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Lado izquierdo con imagen */}
      <div className="hidden md:flex w-2/2 bg-[#e0005d] items-center justify-center">
        <img
/*           src={zapatoAmarillo} */
          alt="Zapato rosita"
          className="max-w-xs object-contain"
        />
      </div>

      {/* Lado derecho con formulario */}
      <div className="w-full md:w-1/2 bg-white text-black flex items-center justify-center px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-[#e0005d] ">Login</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Ingresa a tu cuenta
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  type="text"
                  required
                  placeholder="Nombre de usuario"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 bg-white placeholder-gray-400 text-black rounded-t-md focus:outline-none focus:ring-[#e0005d] focus:border-[#e0005d] sm:text-sm"
                  value={credentials.nombreUsuario}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  placeholder="Contraseña"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 bg-white placeholder-gray-400 text-black rounded-b-md focus:outline-none focus:ring-[#e0005d] focus:border-[#e0005d] sm:text-sm"
                  value={credentials.contrasena}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-700 text-sm">
                <i class="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-[#ed2b7c] text-white hover:bg-[#e0005d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e0005d] disabled:opacity-50 transition-all duration-300 ease-in-out transform cursor-pointer"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="text-sm text-center text-gray-400 mt-4">
            Usuarios de prueba:
            <p><strong>Admin:</strong> admin / password123</p>
            <p><strong>Profesor:</strong> profesor1 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
