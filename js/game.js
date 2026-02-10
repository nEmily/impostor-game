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

  // Rolling history for fair first-player rotation
  const firstPlayerHistory = [];

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
    const count = Math.min(game.settings.impostorCount || 1, game.players.length - 2);
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

    // All impostors get the same hint (the word's own hint)
    game.impostorHints = {};
    game.impostors.forEach(function(idx) {
      game.impostorHints[idx] = word.hint;
    });

    // Store sample words for word preview carousel
    if (word.categoryId) {
      game.sampleWords = Words.getSampleWords(word.categoryId, word.word, 8);
    } else {
      game.sampleWords = [];
    }
  }

  function getPlayerReveal(game, playerIndex) {
    if (game.roles[playerIndex] === 'impostor') {
      var hintsEnabled = game.settings.hintsEnabled !== false;
      var hint = game.impostorHints && game.impostorHints[playerIndex] != null
        ? game.impostorHints[playerIndex]
        : game.word.hint;
      return {
        isImpostor: true,
        hint: hintsEnabled ? hint : null,
        category: game.word.category,
        sampleWords: game.sampleWords || []
      };
    }
    return {
      isImpostor: false,
      word: game.word.word
    };
  }

  function pickFirstPlayer(game) {
    // Fair rotation: exclude players who've already gone first this cycle
    var eligible = game.players.map((_, i) => i);
    if (firstPlayerHistory.length > 0 && firstPlayerHistory.length < game.players.length) {
      var remaining = eligible.filter(i => !firstPlayerHistory.includes(game.players[i]));
      if (remaining.length > 0) eligible = remaining;
    }
    // Reset history when everyone has gone first
    if (firstPlayerHistory.length >= game.players.length) {
      firstPlayerHistory.length = 0;
    }

    // Weighted random within eligible: civilians get 3x weight, impostors get 1x
    const weighted = eligible.map(i => ({
      index: i,
      weight: game.roles[i] === 'impostor' ? 1 : 3
    }));
    const total = weighted.reduce((s, w) => s + w.weight, 0);
    let rand = Math.random() * total;
    for (const w of weighted) {
      rand -= w.weight;
      if (rand <= 0) {
        game.firstPlayer = w.index;
        firstPlayerHistory.push(game.players[w.index]);
        return;
      }
    }
    game.firstPlayer = eligible[0];
    firstPlayerHistory.push(game.players[eligible[0]]);
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
    pickFirstPlayer,
    getPlayerReveal,
    getResults,
    toggleImmunity
  };
})();

// Node.js compat for testing
if (typeof module !== 'undefined') module.exports = Game;
