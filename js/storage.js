/* storage.js — LocalStorage wrapper for settings and player presets */

var Storage = (function () {
  'use strict';

  const KEYS = {
    settings: 'impostor_settings',
    players: 'impostor_players',
    customPacks: 'impostor_custom_packs'
  };

  function saveSettings(settings) {
    try {
      localStorage.setItem(KEYS.settings, JSON.stringify(settings));
    } catch (e) { /* quota exceeded or private browsing */ }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(KEYS.settings);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function savePlayers(players) {
    try {
      localStorage.setItem(KEYS.players, JSON.stringify(players));
    } catch (e) { /* quota exceeded */ }
  }

  function loadPlayers() {
    try {
      const raw = localStorage.getItem(KEYS.players);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveCustomPacks(packs) {
    try {
      localStorage.setItem(KEYS.customPacks, JSON.stringify(packs));
    } catch (e) { /* quota exceeded */ }
  }

  function loadCustomPacks() {
    try {
      const raw = localStorage.getItem(KEYS.customPacks);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  return { saveSettings, loadSettings, savePlayers, loadPlayers, saveCustomPacks, loadCustomPacks };
})();

// Node.js compat for testing
if (typeof module !== 'undefined') module.exports = Storage;
