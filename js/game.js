/* game.js — Game logic: roles, words, state */

var Game = (function () {
  'use strict';

  // Rolling history for anti-repeat impostor selection
  const impostorHistory = []; // last N impostor names
  const HISTORY_SIZE = 3;

  // Secret immunity set (memory only, not persisted)
  const immuneNames = new Set();

  // Session word history to avoid repeats
  const usedWords = [];

  function toggleImmunity(name) {
    if (immuneNames.has(name)) {
      immuneNames.delete(name);
    } else {
      immuneNames.add(name);
    }
  }

  function createGame(players, settings) {
    return {
      players: [...players],
      settings: { ...settings },
      roles: [],       // 'civilian' or 'impostor' per player index
      word: null,       // the secret word object { word, hint, category }
      impostors: []     // indices of impostor players
    };
  }

  function assignRoles(game) {
    const count = game.settings.impostorCount || 1;
    const playerCount = game.players.length;

    // Build candidate pool: exclude immune players and recent impostors
    let candidates = [];
    for (let i = 0; i < playerCount; i++) {
      const name = game.players[i];
      if (immuneNames.has(name)) continue;
      candidates.push(i);
    }

    // Weight candidates: recent impostors get lower weight
    let weighted = candidates.map(i => {
      const name = game.players[i];
      const recentIndex = impostorHistory.lastIndexOf(name);
      if (recentIndex === -1) return { index: i, weight: 10 };
      // More recent = lower weight
      const recency = impostorHistory.length - recentIndex;
      return { index: i, weight: Math.max(1, recency) };
    });

    // If not enough candidates (everyone immune), fall back to all players
    if (weighted.length < count) {
      weighted = game.players.map((_, i) => ({ index: i, weight: 10 }));
    }

    // Weighted random selection
    const selected = [];
    for (let n = 0; n < count; n++) {
      const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
      let rand = Math.random() * totalWeight;
      let chosen = weighted[0];
      for (const w of weighted) {
        rand -= w.weight;
        if (rand <= 0) {
          chosen = w;
          break;
        }
      }
      selected.push(chosen.index);
      weighted = weighted.filter(w => w.index !== chosen.index);
    }

    // Assign roles
    game.roles = game.players.map(() => 'civilian');
    game.impostors = selected;
    selected.forEach(i => {
      game.roles[i] = 'impostor';
    });

    // Update history
    selected.forEach(i => {
      impostorHistory.push(game.players[i]);
    });
    while (impostorHistory.length > HISTORY_SIZE * 2) {
      impostorHistory.shift();
    }

    // Clear immunity after use
    immuneNames.clear();
  }

  function selectWord(game) {
    const word = Words.getRandomWord(game.settings.categories, usedWords);
    game.word = word;
    usedWords.push(word.word);
    // Keep session history bounded
    if (usedWords.length > 100) {
      usedWords.splice(0, usedWords.length - 50);
    }
  }

  function getPlayerReveal(game, playerIndex) {
    if (game.roles[playerIndex] === 'impostor') {
      return {
        isImpostor: true,
        hint: game.word.hint,
        category: game.word.category
      };
    }
    return {
      isImpostor: false,
      word: game.word.word
    };
  }

  function getResults(game) {
    return {
      impostors: game.impostors.map(i => game.players[i]),
      word: game.word.word
    };
  }

  return {
    createGame,
    assignRoles,
    selectWord,
    getPlayerReveal,
    getResults,
    toggleImmunity
  };
})();

// Node.js compat for testing
if (typeof module !== 'undefined') module.exports = Game;
