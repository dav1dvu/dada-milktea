/**
 * Cloud Storage & Persistence Module (Offline-ready)
 * Decoupled from remote JoyUp cloud servers to operate 100% on window.localStorage.
 */
import { save } from './state.js';

// Status and state flags
export const cloudReady = () => false;
export const lastPush = () => null;
export const pullErr = () => null;
export const cloudHad = () => false;
export const pendingAsk = () => null;

/**
 * Returns formatted error text (empty for local mode)
 */
export function errText(err) {
  return '';
}

/**
 * Pull state from remote cloud (offline: returns null immediately)
 */
export async function cloudPull() {
  return null;
}

/**
 * Initialize cloud sync at game boot (offline: resolves immediately to null)
 */
export async function cloudBoot() {
  return null;
}

/**
 * Dialog resolution stubs
 */
export function resolveAsk(choice) {}
export function keepLocal() {
  return true;
}
export function synced() {}

/**
 * Flushes current state to window.localStorage
 */
export async function cloudPush(force = false) {
  try {
    save();
  } catch (err) {
    console.warn('[cloud:push] LocalStorage save warning:', err);
  }
  return true;
}

/**
 * Synchronization trigger - synchronously persists to LocalStorage
 */
export const cloudSync = () => {
  try {
    save();
  } catch (err) {
    console.warn('[cloud:sync] LocalStorage save warning:', err);
  }
  return Promise.resolve(true);
};

/**
 * User login stub (offline: guest mode)
 */
export async function login(mode = 'login') {
  return 'unavailable';
}

/**
 * Carryover save token check (offline: false)
 */
export function takeCarry() {
  return false;
}
