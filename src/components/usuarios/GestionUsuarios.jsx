import { useState } from 'react';
import ListaUsuarios from './ListaUsuarios';
import FormularioUsuarios from './FormularioUsuario';

const GestionUsuarios = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const handleAdd = () => {
    setUsuarioEditar(null);
    setMostrarFormulario(true);
  };

  const handleEdit = (usuario) => {
    setUsuarioEditar(usuario);
    setMostrarFormulario(true);
  };

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setUsuarioEditar(null);
    // La lista se recargará automáticamente
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setUsuarioEditar(null);
  };

  return (
    <div className="w-full">
      <div className="mb-0 sm:mb-5">
          <h2 className="mt-5 sm:mt-0 text-4xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-3 text-center">Gestión de Usuarios</h2>
          <p className="text-gray-600 text-lg text-center">Administra los usuarios del sistema</p>
      </div>
      

      {!mostrarFormulario ? (
        <ListaUsuarios onEdit={handleEdit} onAdd={handleAdd} />
      ) : (
        <FormularioUsuarios 
          usuario={usuarioEditar}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;