// Eventos personalizados para notificar cambios en el estado del jugador

export const PLAYER_UPDATED_EVENT = 'playerUpdated';

/**
 * Dispara un evento personalizado cuando se actualiza el estado del jugador
 */
export function dispatchPlayerUpdated() {
  const event = new CustomEvent(PLAYER_UPDATED_EVENT);
  window.dispatchEvent(event);
}

/**
 * Suscribe una función para que se ejecute cuando se actualice el estado del jugador
 * @param callback Función a ejecutar cuando se actualice el jugador
 * @returns Función para cancelar la suscripción
 */
export function onPlayerUpdated(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(PLAYER_UPDATED_EVENT, handler);
  return () => window.removeEventListener(PLAYER_UPDATED_EVENT, handler);
}
