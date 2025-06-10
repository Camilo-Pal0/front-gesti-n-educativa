import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Loader } from 'lucide-react';

const useToast = () => {
  const showToast = {
    // Success toast con icono personalizado
    success: (message, options = {}) => {
      return toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  ¡Éxito!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      ), { duration: 3000, ...options });
    },

    // Error toast
    error: (message, options = {}) => {
      return toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Error
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      ), { duration: 4000, ...options });
    },

    // Warning toast
    warning: (message, options = {}) => {
      return toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertCircle className="h-10 w-10 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Advertencia
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 3500, ...options });
    },

    // Info toast
    info: (message, options = {}) => {
      return toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Info className="h-10 w-10 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Información
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 3000, ...options });
    },

    // Loading toast
    loading: (message, options = {}) => {
      return toast.loading(message, {
        style: {
          minWidth: '250px',
        },
        ...options
      });
    },

    // Promise toast
    promise: (promise, messages, options = {}) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading || 'Cargando...',
          success: messages.success || '¡Operación exitosa!',
          error: messages.error || 'Algo salió mal',
        },
        {
          style: {
            minWidth: '250px',
          },
          ...options
        }
      );
    },

    // Dismiss toast
    dismiss: (toastId) => {
      toast.dismiss(toastId);
    },

    // Dismiss all toasts
    dismissAll: () => {
      toast.dismiss();
    }
  };

  return showToast;
};

export default useToast;