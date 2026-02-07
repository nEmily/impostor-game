/* app.js — Entry point, screen router, event wiring */

(function () {
  'use strict';

  // --- Screen Router ---
  const screens = {};
  let currentScreen = null;

  function showScreen(id) {
    if (currentScreen) {
      currentScreen.classList.add('hidden');
    }
    const screen = screens[id];
    if (screen) {
      screen.classList.remove('hidden');
      currentScreen = screen;
    }
  }

  // --- State ---
  let players = [];
  let game = null;
  let revealIndex = 0;
  let timerInterval = null;
  let timerRemaining = 0;
  const tapCounts = {}; // for secret immunity: playerName -> { count, lastTap }

  // --- Settings State ---
  let settings = {
    categories: [],
    impostorCount: 1,
    timerEnabled: false,
    timerDuration: 120
  };

  // --- DOM refs ---
  const $ = id => document.getElementById(id);

  // --- Init ---
  function init() {
    // Cache screen elements
    document.querySelectorAll('.screen').forEach(el => {
      screens[el.id.replace('screen-', '')] = el;
    });

    // Load saved settings
    const saved = Storage.loadSettings();
    if (saved) {
      settings = { ...settings, ...saved };
    }

    // Load saved players
    const savedPlayers = Storage.loadPlayers();
    if (savedPlayers && savedPlayers.length > 0) {
      players = savedPlayers;
    }

    // Wire up events
    wireHome();
    wireSetup();
    wireSettings();
    wireReveal();
    wirePlaying();
    wireResults();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    // Hide reveal content when app is backgrounded
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        $('reveal-content').classList.add('hidden');
        $('recheck-content').classList.add('hidden');
        var holdBtns = document.querySelectorAll('.btn-hold.holding');
        holdBtns.forEach(function(b) { b.classList.remove('holding'); });
      }
    });

    // Show home
    showScreen('home');
  }

  // --- Home ---
  function wireHome() {
    $('btn-new-game').addEventListener('click', () => {
      players = [];
      const savedPlayers = Storage.loadPlayers();
      if (savedPlayers && savedPlayers.length > 0) {
        players = savedPlayers;
      }
      renderPlayerList();
      showScreen('setup');
      $('input-player-name').focus();
    });
  }

  // --- Setup ---
  function wireSetup() {
    const input = $('input-player-name');
    const addBtn = $('btn-add-player');

    function addPlayer() {
      const name = input.value.trim();
      if (!name) return;
      if (players.length >= 24) return;
      if (players.some(p => p.toLowerCase() === name.toLowerCase())) {
        input.value = '';
        return;
      }
      players.push(name);
      input.value = '';
      renderPlayerList();
      input.focus();
    }

    addBtn.addEventListener('click', addPlayer);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addPlayer();
      }
    });

    $('btn-setup-back').addEventListener('click', () => {
      showScreen('home');
    });

    $('btn-setup-next').addEventListener('click', () => {
      if (players.length < 3) return;
      Storage.savePlayers(players);
      renderCategories();
      applySettingsToUI();
      showScreen('settings');
    });
  }

  function renderPlayerList() {
    const list = $('player-list');
    list.innerHTML = '';
    players.forEach((name, i) => {
      const li = document.createElement('li');
      li.className = 'player-item';

      const span = document.createElement('span');
      span.className = 'player-name';
      span.textContent = name;

      // Secret immunity: 10x rapid tap
      span.addEventListener('click', () => {
        handleSecretTap(name);
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'player-remove';
      removeBtn.textContent = '\u00d7';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.addEventListener('click', () => {
        players.splice(i, 1);
        delete tapCounts[name];
        renderPlayerList();
      });

      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });

    const count = $('player-count');
    count.textContent = players.length < 3
      ? `Add at least ${3 - players.length} more player${3 - players.length === 1 ? '' : 's'}`
      : `${players.length} player${players.length === 1 ? '' : 's'}`;

    $('btn-setup-next').disabled = players.length < 3;
  }

  function handleSecretTap(name) {
    const now = Date.now();
    if (!tapCounts[name]) {
      tapCounts[name] = { count: 0, lastTap: 0 };
    }
    const entry = tapCounts[name];
    // Reset if more than 500ms between taps
    if (now - entry.lastTap > 500) {
      entry.count = 0;
    }
    entry.count++;
    entry.lastTap = now;
    if (entry.count >= 10) {
      // Toggle immunity silently
      Game.toggleImmunity(name);
      entry.count = 0;
    }
  }

  // --- Settings ---
  function wireSettings() {
    // Impostor count toggles
    document.querySelectorAll('[data-impostors]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-impostors]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.impostorCount = parseInt(btn.dataset.impostors);
      });
    });

    // Timer toggle
    $('toggle-timer').addEventListener('change', e => {
      settings.timerEnabled = e.target.checked;
      $('timer-label').textContent = e.target.checked ? 'On' : 'Off';
      $('timer-options').classList.toggle('hidden', !e.target.checked);
    });

    // Timer duration toggles
    document.querySelectorAll('[data-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-time]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.timerDuration = parseInt(btn.dataset.time);
      });
    });

    $('btn-settings-back').addEventListener('click', () => {
      showScreen('setup');
    });

    $('btn-start-game').addEventListener('click', () => {
      if (settings.categories.length === 0) {
        // Auto-select all if none chosen
        settings.categories = Words.getCategories().map(c => c.id);
        renderCategories();
      }
      Storage.saveSettings(settings);
      startGame();
    });
  }

  function renderCategories() {
    const grid = $('category-list');
    grid.innerHTML = '';
    const categories = Words.getCategories();

    // If no saved categories, select all by default
    if (settings.categories.length === 0) {
      settings.categories = categories.map(c => c.id);
    }

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      if (settings.categories.includes(cat.id)) {
        btn.classList.add('selected');
      }
      btn.textContent = cat.name;
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        if (settings.categories.includes(cat.id)) {
          settings.categories = settings.categories.filter(c => c !== cat.id);
        } else {
          settings.categories.push(cat.id);
        }
      });
      grid.appendChild(btn);
    });
  }

  function applySettingsToUI() {
    // Impostor count
    document.querySelectorAll('[data-impostors]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.impostors) === settings.impostorCount);
    });

    // Timer
    $('toggle-timer').checked = settings.timerEnabled;
    $('timer-label').textContent = settings.timerEnabled ? 'On' : 'Off';
    $('timer-options').classList.toggle('hidden', !settings.timerEnabled);

    // Timer duration
    document.querySelectorAll('[data-time]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.time) === settings.timerDuration);
    });
  }

  // --- Game Start ---
  function startGame() {
    game = Game.createGame(players, settings);
    Game.assignRoles(game);
    Game.selectWord(game);
    revealIndex = 0;
    startReveal();
  }

  // --- Role Reveal ---
  function wireReveal() {
    $('btn-ready').addEventListener('click', () => {
      $('reveal-pass').classList.add('hidden');
      $('reveal-hold').classList.remove('hidden');
    });

    // Hold-to-reveal
    setupHoldButton($('btn-hold-reveal'), $('reveal-content'), () => {
      showRevealContent(revealIndex);
    });

    $('btn-got-it').addEventListener('click', () => {
      revealIndex++;
      if (revealIndex < players.length) {
        startReveal();
      } else {
        startPlaying();
      }
    });

    $('btn-show-again').addEventListener('click', () => {
      $('reveal-confirm').classList.add('hidden');
      $('reveal-hold').classList.remove('hidden');
    });
  }

  function startReveal() {
    $('reveal-pass').classList.remove('hidden');
    $('reveal-hold').classList.add('hidden');
    $('reveal-confirm').classList.add('hidden');
    $('reveal-content').classList.add('hidden');
    $('reveal-player-name').textContent = game.players[revealIndex];
    showScreen('reveal');
  }

  function showRevealContent(playerIndex) {
    const reveal = Game.getPlayerReveal(game, playerIndex);
    const roleEl = $('reveal-role');
    const wordEl = $('reveal-word');
    const hintEl = $('reveal-hint');

    if (reveal.isImpostor) {
      roleEl.textContent = 'IMPOSTOR';
      roleEl.className = 'role-text impostor';
      wordEl.textContent = reveal.hint;
      hintEl.textContent = 'Category: ' + reveal.category;
    } else {
      roleEl.textContent = 'Civilian';
      roleEl.className = 'role-text civilian';
      wordEl.textContent = reveal.word;
      hintEl.textContent = '';
    }
  }

  function setupHoldButton(btn, contentEl, onShow) {
    let holding = false;

    function startHold(e) {
      e.preventDefault();
      holding = true;
      btn.classList.add('holding');
      if (onShow) onShow();
      contentEl.classList.remove('hidden');
    }

    function endHold(e) {
      if (e) e.preventDefault();
      if (!holding) return;
      holding = false;
      btn.classList.remove('holding');
      contentEl.classList.add('hidden');

      // Show confirm state (for role reveal, not re-check)
      if (btn === $('btn-hold-reveal')) {
        $('reveal-hold').classList.add('hidden');
        $('reveal-confirm').classList.remove('hidden');
      }
    }

    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('touchend', endHold, { passive: false });
    btn.addEventListener('touchcancel', endHold, { passive: false });
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', endHold);
    btn.addEventListener('mouseleave', endHold);
  }

  // --- Playing ---
  function wirePlaying() {
    $('btn-check-word').addEventListener('click', () => {
      renderCheckPlayerList();
      $('check-overlay').classList.remove('hidden');
    });

    $('btn-check-cancel').addEventListener('click', () => {
      $('check-overlay').classList.add('hidden');
    });

    // Hold-to-reveal for recheck
    setupHoldButton($('btn-hold-recheck'), $('recheck-content'), null);

    $('btn-recheck-done').addEventListener('click', () => {
      $('recheck-overlay').classList.add('hidden');
      $('recheck-content').classList.add('hidden');
    });

    $('btn-reveal-impostor').addEventListener('click', () => {
      stopTimer();
      showResults();
    });
  }

  function startPlaying() {
    renderPlayingPlayerList();

    if (settings.timerEnabled) {
      $('timer-display').classList.remove('hidden');
      startTimer(settings.timerDuration);
    } else {
      $('timer-display').classList.add('hidden');
    }

    showScreen('playing');
    document.body.classList.add('no-select');
  }

  function renderPlayingPlayerList() {
    const list = $('playing-player-list');
    list.innerHTML = '';
    game.players.forEach(name => {
      const li = document.createElement('li');
      li.className = 'player-item';
      const span = document.createElement('span');
      span.className = 'player-name';
      span.textContent = name;
      li.appendChild(span);
      list.appendChild(li);
    });
  }

  function renderCheckPlayerList() {
    const list = $('check-player-list');
    list.innerHTML = '';
    game.players.forEach((name, i) => {
      const li = document.createElement('li');
      li.className = 'player-item';
      const span = document.createElement('span');
      span.className = 'player-name';
      span.textContent = name;
      li.appendChild(span);
      li.addEventListener('click', () => {
        $('check-overlay').classList.add('hidden');
        openRecheck(i);
      });
      list.appendChild(li);
    });
  }

  function openRecheck(playerIndex) {
    const reveal = Game.getPlayerReveal(game, playerIndex);
    $('recheck-name').textContent = game.players[playerIndex];

    const roleEl = $('recheck-role');
    const wordEl = $('recheck-word');
    const hintEl = $('recheck-hint');

    if (reveal.isImpostor) {
      roleEl.textContent = 'IMPOSTOR';
      roleEl.className = 'role-text impostor';
      wordEl.textContent = reveal.hint;
      hintEl.textContent = 'Category: ' + reveal.category;
    } else {
      roleEl.textContent = 'Civilian';
      roleEl.className = 'role-text civilian';
      wordEl.textContent = reveal.word;
      hintEl.textContent = '';
    }

    $('recheck-content').classList.add('hidden');
    $('recheck-overlay').classList.remove('hidden');
  }

  // --- Timer ---
  function startTimer(seconds) {
    timerRemaining = seconds;
    const total = seconds;
    updateTimerDisplay(total);

    timerInterval = setInterval(() => {
      timerRemaining--;
      updateTimerDisplay(total);
      if (timerRemaining <= 0) {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay(total) {
    const mins = Math.floor(timerRemaining / 60);
    const secs = timerRemaining % 60;
    $('timer-text').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    const progress = (timerRemaining / total) * 100;
    $('timer-bar').style.setProperty('--progress', progress + '%');

    const bar = $('timer-bar');
    bar.classList.remove('warning', 'danger');
    if (progress <= 15) {
      bar.classList.add('danger');
    } else if (progress <= 33) {
      bar.classList.add('warning');
    }
  }

  // --- Results ---
  function wireResults() {
    $('btn-play-again').addEventListener('click', () => {
      // New round, same players and settings
      game = Game.createGame(players, settings);
      Game.assignRoles(game);
      Game.selectWord(game);
      revealIndex = 0;
      document.body.classList.remove('no-select');
      startReveal();
    });

    $('btn-change-settings').addEventListener('click', () => {
      document.body.classList.remove('no-select');
      renderCategories();
      applySettingsToUI();
      showScreen('settings');
    });

    $('btn-new-game-home').addEventListener('click', () => {
      document.body.classList.remove('no-select');
      showScreen('home');
    });
  }

  function showResults() {
    const results = Game.getResults(game);
    $('result-impostor').textContent = results.impostors.join(' & ');
    $('result-word').textContent = results.word;
    document.body.classList.remove('no-select');
    showScreen('results');
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
