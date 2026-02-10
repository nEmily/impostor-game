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
  let playerSetup = { count: 5, customNames: {} };
  let namesExpanded = false;
  let game = null;
  let revealIndex = 0;
  let timerInterval = null;
  let timerRemaining = 0;

  // --- Settings State ---
  let settings = {
    categories: [],
    impostorCount: 1,
    timerEnabled: false,
    timerDuration: 120,
    hintsEnabled: true,
    wordPreviewEnabled: false
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

    // Load saved player setup
    const savedSetup = Storage.loadPlayerSetup();
    if (savedSetup) {
      playerSetup = savedSetup;
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
        // Clear all hold states (both circle and reveal-impostor buttons)
        document.querySelectorAll('.btn-hold.holding, .btn-reveal-impostor.holding').forEach(function(b) {
          b.classList.remove('holding');
        });
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
      const savedSetup = Storage.loadPlayerSetup();
      if (savedSetup) {
        playerSetup = savedSetup;
      }
      namesExpanded = false;
      renderSetupScreen();
      showScreen('setup');
    });
  }

  // --- Setup ---
  function wireSetup() {
    $('btn-stepper-minus').addEventListener('click', () => {
      if (playerSetup.count > 3) {
        playerSetup.count--;
        renderSetupScreen();
      }
    });

    $('btn-stepper-plus').addEventListener('click', () => {
      if (playerSetup.count < 24) {
        playerSetup.count++;
        renderSetupScreen();
      }
    });

    $('btn-customize-names').addEventListener('click', () => {
      namesExpanded = !namesExpanded;
      renderSetupScreen();
    });

    $('btn-setup-back').addEventListener('click', () => {
      showScreen('home');
    });

    $('btn-setup-next').addEventListener('click', () => {
      // Build flat players array for game compat
      players = buildPlayerList();
      Storage.savePlayerSetup(playerSetup);
      Storage.savePlayers(players);
      renderCategories();
      applySettingsToUI();
      showScreen('settings');
    });
  }

  function buildPlayerList() {
    var list = [];
    for (var i = 0; i < playerSetup.count; i++) {
      list.push(playerSetup.customNames[i] || ('Player ' + (i + 1)));
    }
    return list;
  }

  function renderSetupScreen() {
    $('stepper-count').textContent = playerSetup.count;
    $('btn-stepper-minus').disabled = playerSetup.count <= 3;
    $('btn-stepper-plus').disabled = playerSetup.count >= 24;

    var list = $('player-list');
    var wrapper = $('player-list-wrapper');
    var link = $('btn-customize-names');

    if (namesExpanded) {
      link.textContent = 'Hide names';
      wrapper.classList.remove('hidden');
      list.innerHTML = '';
      for (var i = 0; i < playerSetup.count; i++) {
        var li = document.createElement('li');
        li.className = 'player-item';
        var span = document.createElement('span');
        span.className = 'player-name';
        span.textContent = playerSetup.customNames[i] || ('Player ' + (i + 1));
        // Tap to rename — clear default name for easier editing
        (function(idx) {
          li.addEventListener('click', function() {
            var isDefault = !playerSetup.customNames[idx];
            var current = isDefault ? '' : playerSetup.customNames[idx];
            var newName = prompt('Rename player ' + (idx + 1) + ':', current);
            if (newName !== null) {
              newName = newName.trim();
              if (newName) {
                playerSetup.customNames[idx] = newName;
              } else {
                delete playerSetup.customNames[idx];
              }
              renderSetupScreen();
            }
          });
        })(i);
        li.appendChild(span);
        list.appendChild(li);
      }
      // Scroll fade indicator
      function checkSetupScroll() {
        var atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 8;
        wrapper.classList.toggle('scrolled-bottom', atBottom);
      }
      list.addEventListener('scroll', checkSetupScroll);
      checkSetupScroll();
    } else {
      link.textContent = 'Customize names';
      wrapper.classList.add('hidden');
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

    // Hints toggle
    $('toggle-hints').addEventListener('change', e => {
      settings.hintsEnabled = e.target.checked;
    });

    // Word Preview toggle
    $('toggle-word-preview').addEventListener('change', e => {
      settings.wordPreviewEnabled = e.target.checked;
    });

    // Timer toggle
    $('toggle-timer').addEventListener('change', e => {
      settings.timerEnabled = e.target.checked;
      $('timer-duration').disabled = !e.target.checked;
    });

    // Timer duration select
    $('timer-duration').addEventListener('change', e => {
      settings.timerDuration = parseInt(e.target.value);
    });

    $('btn-settings-back').addEventListener('click', () => {
      renderSetupScreen();
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

    // Scroll fade indicator
    var wrapper = grid.parentElement;
    function checkScroll() {
      var atBottom = grid.scrollHeight - grid.scrollTop - grid.clientHeight < 8;
      wrapper.classList.toggle('scrolled-bottom', atBottom);
    }
    grid.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  function applySettingsToUI() {
    // Impostor count
    document.querySelectorAll('[data-impostors]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.impostors) === settings.impostorCount);
    });

    // Hints
    $('toggle-hints').checked = settings.hintsEnabled !== false;

    // Word Preview
    $('toggle-word-preview').checked = !!settings.wordPreviewEnabled;

    // Timer
    $('toggle-timer').checked = settings.timerEnabled;
    $('timer-duration').disabled = !settings.timerEnabled;
    $('timer-duration').value = settings.timerDuration;
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
    setupHoldButton($('btn-hold-reveal'), $('reveal-content'), {
      hintEl: $('reveal-hold-hint'),
      onShow: function() { showRevealContent(revealIndex); },
      onRelease: function() {
        $('btn-got-it').classList.remove('invisible');
        $('btn-got-it').disabled = false;
      }
    });

    $('btn-got-it').addEventListener('click', () => {
      revealIndex++;
      if (revealIndex < players.length) {
        startReveal();
      } else {
        startPlaying();
      }
    });
  }

  function startReveal() {
    $('reveal-pass').classList.remove('hidden');
    $('reveal-hold').classList.add('hidden');
    $('reveal-content').classList.add('hidden');
    $('reveal-hold-hint').classList.remove('hidden');
    $('btn-got-it').classList.add('invisible');
    $('btn-got-it').disabled = true;
    var name = game.players[revealIndex];
    $('reveal-player-name').textContent = name;
    $('reveal-hold-name').textContent = name;
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
      wordEl.textContent = '';
      var hintHtml = '';
      if (reveal.hint) {
        hintHtml += '<span>Your hint: ' + escapeHtml(reveal.hint) + '</span><br>';
      }
      hintHtml += '<span class="hint-category">Category: ' + escapeHtml(reveal.category) + '</span>';
      hintEl.innerHTML = hintHtml;

      // Start word carousel if enabled
      if (settings.wordPreviewEnabled && reveal.sampleWords && reveal.sampleWords.length > 0) {
        startCarousel($('word-carousel'), reveal.sampleWords);
      } else {
        stopCarousel();
        var carousel = $('word-carousel');
        if (carousel) carousel.classList.add('hidden');
      }
    } else {
      roleEl.textContent = 'Civilian';
      roleEl.className = 'role-text civilian';
      wordEl.textContent = reveal.word;
      hintEl.innerHTML = '';
      stopCarousel();
      var carousel = $('word-carousel');
      if (carousel) carousel.classList.add('hidden');
    }
  }

  function setupHoldButton(btn, contentEl, opts) {
    var onShow = opts && opts.onShow;
    var onRelease = opts && opts.onRelease;
    var hintEl = opts && opts.hintEl;
    let holding = false;
    let isTouch = false;

    function startHold(e) {
      e.preventDefault();
      if (e.type === 'touchstart') isTouch = true;
      if (e.type === 'mousedown' && isTouch) return;
      holding = true;
      btn.classList.add('holding');
      if (onShow) onShow();
      contentEl.classList.remove('hidden');
      if (hintEl) hintEl.classList.add('hidden');
    }

    function endHold(e) {
      if (e) e.preventDefault();
      // Ignore synthetic mouse events on touch devices
      if (e && isTouch && (e.type === 'mouseleave' || e.type === 'mouseup')) return;
      if (!holding) return;
      holding = false;
      isTouch = false;
      btn.classList.remove('holding');
      contentEl.classList.add('hidden');
      if (hintEl) hintEl.classList.remove('hidden');
      stopCarousel();

      if (onRelease) {
        onRelease();
      }
    }

    function preventMove(e) {
      if (holding) e.preventDefault();
    }

    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('touchend', endHold, { passive: false });
    btn.addEventListener('touchcancel', endHold, { passive: false });
    btn.addEventListener('touchmove', preventMove, { passive: false });
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
    setupHoldButton($('btn-hold-recheck'), $('recheck-content'), {
      hintEl: $('recheck-hold-hint')
    });

    $('btn-recheck-done').addEventListener('click', () => {
      $('recheck-overlay').classList.add('hidden');
      $('recheck-content').classList.add('hidden');
    });

    // Timed hold-to-reveal for impostor (3 second hold required)
    (function() {
      var btn = $('btn-reveal-impostor');
      var fillEl = btn.querySelector('.reveal-impostor-fill');
      var textEl = btn.querySelector('.reveal-impostor-text');
      var countdownEl = btn.querySelector('.reveal-impostor-countdown');
      var holdTimer = null;
      var holding = false;
      var isTouch = false;
      var TOTAL = 3;

      function startHold(e) {
        e.preventDefault();
        if (e.type === 'touchstart') isTouch = true;
        if (e.type === 'mousedown' && isTouch) return;
        holding = true;
        btn.classList.add('holding');
        countdownEl.classList.remove('hidden');
        textEl.classList.add('hidden');

        var remaining = TOTAL;
        countdownEl.textContent = remaining + '...';
        // Reset fill bar then start one smooth continuous animation
        fillEl.style.transition = 'none';
        fillEl.style.width = '0%';
        void fillEl.offsetWidth;
        fillEl.style.transition = 'width ' + TOTAL + 's linear';
        fillEl.style.width = '100%';

        // Countdown text only — fill runs independently via CSS
        holdTimer = setInterval(function() {
          remaining--;
          if (remaining > 0) {
            countdownEl.textContent = remaining + '...';
          } else {
            clearInterval(holdTimer);
            holdTimer = null;
            holding = false;
            resetBtn();
            stopTimer();
            showResults();
          }
        }, 1000);
      }

      function resetBtn() {
        btn.classList.remove('holding');
        countdownEl.classList.add('hidden');
        textEl.classList.remove('hidden');
        fillEl.style.transition = 'none';
        fillEl.style.width = '0%';
      }

      function endHold(e) {
        if (e) e.preventDefault();
        if (e && isTouch && (e.type === 'mouseleave' || e.type === 'mouseup')) return;
        if (!holding) return;
        holding = false;
        isTouch = false;
        if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
        resetBtn();
      }

      function preventMove(e) {
        if (holding) e.preventDefault();
      }

      btn.addEventListener('touchstart', startHold, { passive: false });
      btn.addEventListener('touchend', endHold, { passive: false });
      btn.addEventListener('touchcancel', endHold, { passive: false });
      btn.addEventListener('touchmove', preventMove, { passive: false });
      btn.addEventListener('mousedown', startHold);
      btn.addEventListener('mouseup', endHold);
      btn.addEventListener('mouseleave', endHold);
    })();
  }

  function startPlaying() {
    // Reset reveal impostor button state
    var revealBtn = $('btn-reveal-impostor');
    revealBtn.classList.remove('holding');
    revealBtn.querySelector('.reveal-impostor-countdown').classList.add('hidden');
    revealBtn.querySelector('.reveal-impostor-text').classList.remove('hidden');
    var fillEl = revealBtn.querySelector('.reveal-impostor-fill');
    fillEl.style.transition = 'none';
    fillEl.style.width = '0%';

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

  // --- Word Carousel ---
  var carouselTimer = null;
  var carouselIndex = 0;

  function startCarousel(el, words) {
    if (!el || !words || words.length === 0) return;
    stopCarousel();
    el.classList.remove('hidden');
    var wordEl = el.querySelector('.carousel-word');
    carouselIndex = 0;
    wordEl.textContent = words[0];
    wordEl.classList.remove('fade-out');

    carouselTimer = setInterval(function() {
      wordEl.classList.add('fade-out');
      setTimeout(function() {
        carouselIndex = (carouselIndex + 1) % words.length;
        wordEl.textContent = words[carouselIndex];
        wordEl.classList.remove('fade-out');
      }, 300);
    }, 1500);
  }

  function stopCarousel() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  function renderCheckPlayerList() {
    const list = $('check-player-list');
    const wrapper = list.parentElement;
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
    // Scroll fade indicator
    function checkScroll() {
      var atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 8;
      wrapper.classList.toggle('scrolled-bottom', atBottom);
    }
    list.addEventListener('scroll', checkScroll);
    checkScroll();
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
      wordEl.textContent = '';
      var hintHtml = '';
      if (reveal.hint) {
        hintHtml += '<span>Your hint: ' + escapeHtml(reveal.hint) + '</span><br>';
      }
      hintHtml += '<span class="hint-category">Category: ' + escapeHtml(reveal.category) + '</span>';
      hintEl.innerHTML = hintHtml;
    } else {
      roleEl.textContent = 'Civilian';
      roleEl.className = 'role-text civilian';
      wordEl.textContent = reveal.word;
      hintEl.innerHTML = '';
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
