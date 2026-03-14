/**
 * GymOS v9 — Event Bus
 * Lightweight pub/sub for decoupled communication
 */

const listeners = new Map();

/**
 * Subscribe to an event
 * @param {string} event
 * @param {(payload?: any) => void} handler
 * @returns {() => void} Unsubscribe function
 */
export function on(event, handler) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(handler);
  return () => listeners.get(event)?.delete(handler);
}

/**
 * Emit an event to all subscribers
 * @param {string} event
 * @param {any} [payload]
 */
export function emit(event, payload) {
  listeners.get(event)?.forEach((handler) => handler(payload));
}

/**
 * Remove all listeners for an event (or all events)
 * @param {string} [event]
 */
export function off(event) {
  if (event) {
    listeners.delete(event);
  } else {
    listeners.clear();
  }
}
