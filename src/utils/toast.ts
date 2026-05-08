type ToastType = 'success' | 'error' | 'info';

interface ToastEvent {
  message: string;
  type: ToastType;
  id: number;
}

type ToastListener = (event: ToastEvent) => void;

let listeners: ToastListener[] = [];
let toastId = 0;

function emit(message: string, type: ToastType) {
  const event: ToastEvent = { message, type, id: ++toastId };
  listeners.forEach((fn) => fn(event));
}

const toast = {
  success: (message: string) => emit(message, 'success'),
  error: (message: string) => emit(message, 'error'),
  info: (message: string) => emit(message, 'info'),
  subscribe: (fn: ToastListener) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};

export default toast;
