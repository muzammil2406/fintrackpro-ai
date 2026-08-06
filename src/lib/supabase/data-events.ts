type Listener = () => void;

const listeners = new Set<Listener>();

export function onDataChanged(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function notifyDataChanged() {
  listeners.forEach((callback) => callback());
}
