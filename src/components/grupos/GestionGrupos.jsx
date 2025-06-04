import { useState } from 'react';
import ListaGrupos from './ListaGrupos';
import FormularioGrupo from './FormularioGrupo';
import GestionarEstudiantes from './GestionarEstudiantes';

const GestionGrupos = () => {
  const [vistaActual, setVistaActual] = useState('lista');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  const handleAdd = () => {
    setGrupoSeleccionado(null);
    setVistaActual('formulario');
  };

  const handleEdit = (grupo) => {
    setGrupoSeleccionado(grupo);
    setVistaActual('formulario');
  };

  const handleManageStudents = (grupo) => {
    setGrupoSeleccionado(grupo);
    setVistaActual('estudiantes');
  };

  const handleSuccess = () => {
    setVistaActual('lista');
    setGrupoSeleccionado(null);
  };

  const handleBack = () => {
    setVistaActual('lista');
    setGrupoSeleccionado(null);
  };

  const renderContenido = () => {
    switch (vistaActual) {
      case 'formulario':
        return (
          <FormularioGrupo 
            grupo={grupoSeleccionado}
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        );
      case 'estudiantes':
        return (
          <GestionarEstudiantes
            grupo={grupoSeleccionado}
            onBack={handleBack}
          />
        );
      case 'lista':
      default:
        return (
          <ListaGrupos 
            onEdit={handleEdit} 
            onAdd={handleAdd}
            onManageStudents={handleManageStudents}
          />
        );
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Gestión de Grupos</h2>
      {renderContenido()}
    </div>
  );
};

export default GestionGrupos;