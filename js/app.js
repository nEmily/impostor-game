/* app.js — Entry point, screen router, event wiring */

(function () {
  'use strict';

  // --- Screen Router ---
  const screens = {};
  let currentScreen = null;
  let currentScreenId = null;
  let handlingPopState = false;

  function showScreen(id) {
    if (currentScreen) {
      currentScreen.classList.add('hidden');
    }
    const screen = screens[id];
    if (screen) {
      screen.classList.remove('hidden');
      currentScreen = screen;
      currentScreenId = id;
      // Push history state so back button navigates between screens
      if (!handlingPopState) {
        history.pushState({ screen: id }, '', '');
      }
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

    // Load custom word packs
    Words.loadCustomPacks(Storage.loadCustomPacks());

    // Wire up events
    wireHome();
    wireSetup();
    wireSettings();
    wireReveal();
    wirePlaying();
    wireResults();
    wireCustomPacks();

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

    // Handle back button
    window.addEventListener('popstate', function(e) {
      if (e.state && e.state.screen) {
        handlingPopState = true;
        showScreen(e.state.screen);
        handlingPopState = false;
      } else {
        // No state = initial entry, show home
        handlingPopState = true;
        showScreen('home');
        handlingPopState = false;
        // Push home state so next back exits the app
        history.replaceState({ screen: 'home' }, '', '');
      }
    });

    // Show home
    history.replaceState({ screen: 'home' }, '', '');
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
      if (players.length >= 24) {
        showSetupHint('Maximum 24 players');
        return;
      }
      if (players.some(p => p.toLowerCase() === name.toLowerCase())) {
        showSetupHint('"' + name + '" is already added');
        input.value = '';
        return;
      }
      players.push(name);
      input.value = '';
      renderPlayerList();
      input.focus();
    }

    function showSetupHint(msg) {
      var count = $('player-count');
      count.textContent = msg;
      count.classList.add('hint-flash');
      setTimeout(function() { count.classList.remove('hint-flash'); }, 1500);
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
      // Clamp impostor count to valid range
      var maxImpostors = Math.max(1, players.length - 2);
      if (settings.impostorCount > maxImpostors) {
        settings.impostorCount = maxImpostors;
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
    Game.pickFirstPlayer(game);
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

    var revealConfirmTimeout = null;
    $('btn-reveal-impostor').addEventListener('click', () => {
      $('btn-reveal-impostor').classList.add('hidden');
      $('btn-reveal-confirm').classList.remove('hidden');
      // Auto-reset after 3 seconds if not confirmed
      clearTimeout(revealConfirmTimeout);
      revealConfirmTimeout = setTimeout(() => {
        $('btn-reveal-confirm').classList.add('hidden');
        $('btn-reveal-impostor').classList.remove('hidden');
      }, 3000);
    });

    $('btn-reveal-confirm').addEventListener('click', () => {
      clearTimeout(revealConfirmTimeout);
      $('btn-reveal-confirm').classList.add('hidden');
      $('btn-reveal-impostor').classList.remove('hidden');
      stopTimer();
      showResults();
    });
  }

  function startPlaying() {
    renderPlayingPlayerList();

    // Reset reveal confirm state
    $('btn-reveal-confirm').classList.add('hidden');
    $('btn-reveal-impostor').classList.remove('hidden');

    // Show who goes first
    var firstName = game.players[game.firstPlayer];
    $('first-player').innerHTML = '<strong>' + escapeHtml(firstName) + '</strong> goes first';

    if (settings.timerEnabled) {
      $('timer-display').classList.remove('hidden');
      startTimer(settings.timerDuration);
    } else {
      $('timer-display').classList.add('hidden');
    }

    showScreen('playing');
    document.body.classList.add('no-select');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    stopTimer();
    $('timer-display').classList.remove('timer-expired');
    timerRemaining = seconds;
    const total = seconds;
    updateTimerDisplay(total);

    timerInterval = setInterval(() => {
      timerRemaining--;
      updateTimerDisplay(total);
      if (timerRemaining <= 0) {
        stopTimer();
        onTimerExpired();
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

  function onTimerExpired() {
    $('timer-text').textContent = "TIME'S UP!";
    $('timer-display').classList.add('timer-expired');
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  // --- Results ---
  function wireResults() {
    $('btn-play-again').addEventListener('click', () => {
      // New round, same players and settings
      stopTimer();
      game = Game.createGame(players, settings);
      Game.assignRoles(game);
      Game.selectWord(game);
      Game.pickFirstPlayer(game);
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
    $('result-heading').textContent = results.impostors.length > 1
      ? 'The impostors were...' : 'The impostor was...';
    $('result-impostor').textContent = results.impostors.join(' & ');
    $('result-word').textContent = results.word;
    document.body.classList.remove('no-select');
    showScreen('results');
  }

  // --- Custom Packs ---
  let customPacks = []; // array of { name, words: [{ word, hint }] }
  let editingPackIndex = -1; // -1 = new pack
  let editorWords = []; // temp word list while editing

  function wireCustomPacks() {
    customPacks = Storage.loadCustomPacks();

    $('btn-custom-packs').addEventListener('click', () => {
      renderCustomPackList();
      $('custom-list-overlay').classList.remove('hidden');
    });

    $('btn-custom-list-close').addEventListener('click', () => {
      $('custom-list-overlay').classList.add('hidden');
      renderCategories(); // refresh category grid with any new packs
    });

    $('btn-new-pack').addEventListener('click', () => {
      openPackEditor(-1);
    });

    // Editor events
    $('btn-add-word').addEventListener('click', addEditorWord);
    $('input-hint').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addEditorWord(); }
    });
    $('input-word').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); $('input-hint').focus(); }
    });

    $('input-pack-name').addEventListener('input', () => {
      $('btn-custom-save').disabled = editorWords.length < 3 || !$('input-pack-name').value.trim();
    });

    $('btn-custom-cancel').addEventListener('click', () => {
      $('custom-overlay').classList.add('hidden');
    });

    $('btn-custom-save').addEventListener('click', () => {
      var name = $('input-pack-name').value.trim();
      if (!name || editorWords.length < 3) return;

      var pack = { name: name, words: editorWords.map(w => ({ word: w.word, hint: w.hint })) };
      if (editingPackIndex >= 0) {
        customPacks[editingPackIndex] = pack;
      } else {
        customPacks.push(pack);
      }
      saveAndReloadPacks();
      $('custom-overlay').classList.add('hidden');
      renderCustomPackList();
    });

    $('btn-custom-delete').addEventListener('click', () => {
      if (editingPackIndex >= 0) {
        // Remove the deleted pack's category from selections
        // Since indices shift after splice, remove all custom_ and re-map
        var oldCustomIds = customPacks.map((_, i) => 'custom_' + i);
        var selectedCustomIndices = [];
        settings.categories.forEach(c => {
          if (c.startsWith('custom_')) {
            var idx = parseInt(c.replace('custom_', ''));
            if (idx !== editingPackIndex) {
              // Adjust index: if it was after the deleted one, shift down
              selectedCustomIndices.push(idx > editingPackIndex ? idx - 1 : idx);
            }
          }
        });
        customPacks.splice(editingPackIndex, 1);
        // Rebuild categories: keep non-custom, add remapped custom
        settings.categories = settings.categories.filter(c => !c.startsWith('custom_'));
        selectedCustomIndices.forEach(i => {
          settings.categories.push('custom_' + i);
        });
        saveAndReloadPacks();
        $('custom-overlay').classList.add('hidden');
        renderCustomPackList();
      }
    });
  }

  function saveAndReloadPacks() {
    Storage.saveCustomPacks(customPacks);
    Words.loadCustomPacks(customPacks);
  }

  function renderCustomPackList() {
    var list = $('custom-pack-list');
    list.innerHTML = '';
    if (customPacks.length === 0) {
      var li = document.createElement('li');
      li.className = 'player-item';
      li.innerHTML = '<span class="player-name" style="color:var(--text-dim)">No custom packs yet</span>';
      list.appendChild(li);
      return;
    }
    customPacks.forEach(function(pack, i) {
      var li = document.createElement('li');
      li.className = 'player-item';
      var span = document.createElement('span');
      span.className = 'player-name';
      span.textContent = pack.name + ' (' + pack.words.length + ')';
      li.appendChild(span);
      li.addEventListener('click', function() { openPackEditor(i); });
      list.appendChild(li);
    });
  }

  function openPackEditor(index) {
    editingPackIndex = index;
    if (index >= 0) {
      var pack = customPacks[index];
      $('input-pack-name').value = pack.name;
      editorWords = pack.words.map(function(w) { return { word: w.word, hint: w.hint }; });
      $('custom-editor-title').textContent = 'Edit Pack';
      $('btn-custom-delete').classList.remove('hidden');
    } else {
      $('input-pack-name').value = '';
      editorWords = [];
      $('custom-editor-title').textContent = 'New Pack';
      $('btn-custom-delete').classList.add('hidden');
    }
    renderEditorWords();
    $('custom-list-overlay').classList.add('hidden');
    $('custom-overlay').classList.remove('hidden');
    $('input-pack-name').focus();
  }

  function addEditorWord() {
    var word = $('input-word').value.trim();
    var hint = $('input-hint').value.trim();
    if (!word) return;
    // Prevent duplicate words in the pack
    if (editorWords.some(function(w) { return w.word.toLowerCase() === word.toLowerCase(); })) {
      $('input-word').value = '';
      return;
    }
    if (!hint) hint = '???';
    editorWords.push({ word: word, hint: hint });
    $('input-word').value = '';
    $('input-hint').value = '';
    renderEditorWords();
    $('input-word').focus();
  }

  function renderEditorWords() {
    var list = $('custom-word-list');
    list.innerHTML = '';
    editorWords.forEach(function(w, i) {
      var li = document.createElement('li');
      li.className = 'player-item';
      var span = document.createElement('span');
      span.className = 'player-name';
      span.textContent = w.word + ' \u2192 ' + w.hint;
      var removeBtn = document.createElement('button');
      removeBtn.className = 'player-remove';
      removeBtn.textContent = '\u00d7';
      removeBtn.addEventListener('click', function() {
        editorWords.splice(i, 1);
        renderEditorWords();
      });
      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
    $('custom-word-count').textContent = editorWords.length + ' word' + (editorWords.length === 1 ? '' : 's') + (editorWords.length < 3 ? ' (need at least 3)' : '');
    $('btn-custom-save').disabled = editorWords.length < 3 || !$('input-pack-name').value.trim();
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
