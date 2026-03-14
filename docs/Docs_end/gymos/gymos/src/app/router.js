/**
 * GymOS v9 — Router
 * Screen navigation and URL sync (hash-based for SPA)
 */

import { getState, setState } from './app-state.js';
import { SCREENS, DEFAULT_SCREEN } from './config.js';
import { emit } from './event-bus.js';

/**
 * Navigate to a screen by name
 * @param {string} screenName
 */
export function navigate(screenName) {
  if (!SCREENS.includes(screenName)) {
    screenName = DEFAULT_SCREEN;
  }

  setState({ screen: screenName });

  // Update DOM — show only the active screen
  document.querySelectorAll('.screen').forEach((el) => {
    const isActive = el.getAttribute('data-screen') === screenName;
    el.classList.toggle('active', isActive);
  });
  document.querySelectorAll('.navBtn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-screen') === screenName);
  });

  // Sync hash for bookmarking / back button
  if (window.location.hash !== `#${screenName}`) {
    window.location.hash = screenName;
  }

  emit('screen:changed', { screen: screenName });
}

/**
 * Get current screen from state
 */
export function getCurrentScreen() {
  return getState().screen || DEFAULT_SCREEN;
}

/**
 * Initialize router: bind nav buttons and hash changes
 */
export function initRouter() {
  // Nav button clicks — use event delegation so it works even when content is re-rendered
  const navShell = document.querySelector('.navShell');
  if (navShell) {
    navShell.addEventListener('click', (e) => {
      const btn = e.target.closest('.navBtn');
      if (btn && btn.dataset.screen) {
        e.preventDefault();
        navigate(btn.dataset.screen);
      }
    });
  }

  // Hash change (e.g. back button)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || DEFAULT_SCREEN;
    if (SCREENS.includes(hash)) {
      navigate(hash);
    }
  });

  // Initial navigation — show correct screen
  const hash = window.location.hash.slice(1);
  const target = (hash && SCREENS.includes(hash)) ? hash : getCurrentScreen();
  navigate(target);
}
