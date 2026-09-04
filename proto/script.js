(() => {
  'use strict';

  /* ============================================================
     STATE
     ============================================================ */

  const NETWORK_STATES = {
    online: {
      label: 'ONLINE',
      dotTone: 'green',
      pulse: false,
      heroLine1: 'Internet available',
      heroLine2: 'Communication operational',
      internet: 'Available',
      mesh: 'Standby',
      messages: 'Operational',
      relayDirect: true,
      legend: 'Messages transmit normally over the direct link.',
    },
    limited: {
      label: 'LIMITED',
      dotTone: 'green',
      pulse: true,
      heroLine1: 'Limited connectivity',
      heroLine2: 'Communication operational',
      internet: 'Degraded',
      mesh: 'Standby',
      messages: 'Operational — delayed',
      relayDirect: true,
      legend: 'The link is weak. Messages still send, but take longer.',
    },
    intermittent: {
      label: 'INTERMITTENT',
      dotTone: 'gray',
      pulse: true,
      heroLine1: 'Intermittent connection',
      heroLine2: 'Messages may queue briefly',
      internet: 'Unstable',
      mesh: 'Ready',
      messages: 'Queuing enabled',
      relayDirect: true,
      legend: 'The link drops in and out. Messages queue until it returns.',
    },
    offline: {
      label: 'MESH ACTIVE',
      dotTone: 'green',
      pulse: false,
      heroLine1: 'Internet unavailable',
      heroLine2: 'Communication operational',
      internet: 'Unavailable',
      mesh: 'Active',
      messages: 'Operational via mesh',
      relayDirect: false,
      legend: 'No internet reachable. Messages relay through nearby nodes.',
    },
  };

  const NODES = [
    { id: 'you', name: 'You', role: 'you', internet: false },
    { id: 'f1', name: 'Field Unit 01', role: 'relay', internet: true },
    { id: 'f2', name: 'Field Unit 02', role: 'relay', internet: false },
    { id: 'base', name: 'Base Node', role: 'base', internet: true },
  ];

  const EMERGENCY_TYPES = [
    { id: 'medical', label: 'Need Medical Assistance', icon: 'cross' },
    { id: 'trapped', label: 'People Trapped', icon: 'door-closed' },
    { id: 'water', label: 'Need Water', icon: 'droplet' },
    { id: 'fire', label: 'Fire / Danger', icon: 'flame' },
    { id: 'evacuate', label: 'Evacuation Required', icon: 'log-out' },
  ];

  const INCOMING_REPLIES = [
    'Copy that.',
    'Received, standing by.',
    'Acknowledged at base.',
    'Copy, relay confirmed.',
  ];

  const state = {
    network: 'offline',
    messages: [
      {
        id: 'seed-1',
        dir: 'in',
        text: 'Base Node online. Mesh relay ready.',
        status: 'delivered',
        size: '56 bits',
        time: Date.now() - 6 * 60 * 1000,
        hops: null,
      },
    ],
    voiceLog: [],
    alerts: [],
    activity: [
      {
        icon: 'git-branch',
        tone: 'green',
        text: 'Mesh relay established with 3 nodes',
        time: Date.now() - 6 * 60 * 1000,
      },
    ],
  };

  let currentScreen = 'home';
  let pendingEmergency = null;

  /* ============================================================
     HELPERS
     ============================================================ */

  const $ = (id) => document.getElementById(id);

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function timeAgo(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  }

  function estimateSize(text) {
    const bits = Math.max(24, Math.round(text.length * 5.4));
    return `${bits} bits`;
  }

  function pushActivity(icon, tone, text) {
    state.activity.unshift({ icon, tone, text, time: Date.now() });
    state.activity = state.activity.slice(0, 20);
    if (currentScreen === 'home') renderActivity();
  }

  function showToast(text, tone = 'default', icon = 'check') {
    const stack = $('toastStack');
    const el = document.createElement('div');
    el.className = `toast${tone === 'red' ? ' tone-red' : ''}${tone === 'green' ? ' tone-green' : ''}`;
    el.innerHTML = `<i data-lucide="${icon}"></i><span>${text}</span>`;
    stack.appendChild(el);
    refreshIcons();
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 200);
    }, 2600);
  }

  function relayPath() {
    const cfg = NETWORK_STATES[state.network];
    return cfg.relayDirect ? ['you', 'base'] : ['you', 'f1', 'f2', 'base'];
  }

  function hopTrailHtml(path) {
    return path
      .map((id, i) => {
        const node = NODES.find((n) => n.id === id);
        const label = id === 'you' ? 'YOU' : node.name.toUpperCase();
        const cls = i === 0 ? 'is-you' : i === path.length - 1 ? 'is-dest' : '';
        const nodeHtml = `<span class="hop-node ${cls}">${label}</span>`;
        return i === 0 ? nodeHtml : `<span class="hop-arrow">›</span>${nodeHtml}`;
      })
      .join('');
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */

  function showScreen(name) {
    currentScreen = name;
    document.querySelectorAll('.screen').forEach((s) => {
      s.hidden = s.id !== `screen-${name}`;
    });
    document.querySelectorAll('.nav-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.nav === name);
    });
    if (name === 'home') renderActivity();
    if (name === 'chat') { renderMessages(); scrollChatToBottom(); }
    if (name === 'voice') renderVoiceLog();
    if (name === 'network') renderNetworkScreen();
    if (name === 'emergency') renderAlertLog();
  }

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => showScreen(el.dataset.nav));
  });

  /* ============================================================
     SHEETS
     ============================================================ */

  function openSheet(id) {
    $('scrim').classList.add('is-visible');
    $(id).classList.add('is-open');
  }
  function closeAllSheets() {
    $('scrim').classList.remove('is-visible');
    document.querySelectorAll('.sheet').forEach((s) => s.classList.remove('is-open'));
  }
  $('scrim').addEventListener('click', closeAllSheets);

  /* ============================================================
     GLOBAL STATUS RENDER (app bar, home hero)
     ============================================================ */

  function renderStatus() {
    const cfg = NETWORK_STATES[state.network];

    const dot = $('statusDot');
    dot.className = `status-dot${cfg.dotTone === 'gray' ? ' tone-gray' : ''}`;
    $('statusChipLabel').textContent = cfg.label;

    $('heroLine1').textContent = cfg.heroLine1;
    $('heroLine2').textContent = cfg.heroLine2;

    $('heroRows').innerHTML = `
      <div class="hero-row">
        <span class="hero-row-label">Internet</span>
        <span class="hero-row-value ${cfg.internet === 'Available' ? 'tone-green' : 'tone-muted'}">${cfg.internet}</span>
      </div>
      <div class="hero-row">
        <span class="hero-row-label">Mesh</span>
        <span class="hero-row-value ${cfg.mesh === 'Active' ? 'tone-green' : 'tone-muted'}">${cfg.mesh}</span>
      </div>
      <div class="hero-row">
        <span class="hero-row-label">Messages</span>
        <span class="hero-row-value tone-green">${cfg.messages}</span>
      </div>
    `;

    $('netInternetValue').textContent = cfg.internet;
    $('netInternetValue').className = `summary-split-value ${cfg.internet === 'Available' ? 'tone-green' : 'tone-gray'}`;
    $('netMeshValue').textContent = cfg.mesh;
    $('netMeshValue').className = `summary-split-value ${cfg.mesh !== 'Standby' ? 'tone-green' : 'tone-gray'}`;

    if (currentScreen === 'network') renderNetworkScreen();
  }

  function buildNetworkOptions() {
    $('networkOptions').innerHTML = Object.keys(NETWORK_STATES)
      .map((key) => {
        const cfg = NETWORK_STATES[key];
        const selected = key === state.network;
        return `
          <button class="sheet-option${selected ? ' is-selected' : ''}" data-state="${key}" type="button">
            <span>
              <span class="sheet-option-label">${cfg.label}</span>
              <span class="sheet-option-desc">${cfg.legend}</span>
            </span>
            ${selected ? '<i data-lucide="check" class="sheet-option-check"></i>' : ''}
          </button>
        `;
      })
      .join('');
    refreshIcons();

    $('networkOptions').querySelectorAll('.sheet-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.network = btn.dataset.state;
        renderStatus();
        buildNetworkOptions();
        pushActivity('git-branch', 'gray', `Link condition set to <b>${NETWORK_STATES[state.network].label}</b>`);
        closeAllSheets();
        showToast(`Simulating ${NETWORK_STATES[state.network].label.toLowerCase()}`, 'default', 'radio');
      });
    });
  }

  $('statusChip').addEventListener('click', () => {
    buildNetworkOptions();
    openSheet('sheetNetwork');
  });

  /* ============================================================
     HOME — ACTIVITY FEED
     ============================================================ */

  function renderActivity() {
    const list = $('activityList');
    if (!state.activity.length) {
      list.innerHTML = `<li class="list-empty">No activity yet</li>`;
      return;
    }
    list.innerHTML = state.activity
      .map(
        (a) => `
        <li class="activity-item">
          <span class="activity-icon tone-${a.tone}"><i data-lucide="${a.icon}"></i></span>
          <div class="activity-body">
            <p class="activity-text">${a.text}</p>
            <div class="activity-meta"><span>${timeAgo(a.time)}</span></div>
          </div>
        </li>`
      )
      .join('');
    refreshIcons();
  }

  /* ============================================================
     CHAT
     ============================================================ */

  function statusBadgeHtml(status) {
    const map = {
      queued: { cls: 'st-queued', label: 'Queued' },
      transmitting: { cls: 'st-transmitting', label: 'Transmitting…' },
      relayed: { cls: 'st-relayed', label: 'Relayed' },
      delivered: { cls: 'st-delivered', label: 'Delivered' },
    };
    const m = map[status] || map.delivered;
    return `<span class="status-badge ${m.cls}">${m.label}</span>`;
  }

  function renderMessages() {
    const list = $('messageList');
    if (!state.messages.length) {
      list.innerHTML = `<li class="list-empty">No messages yet</li>`;
      return;
    }
    list.innerHTML = state.messages
      .map((m) => {
        const meta = [`<span>${m.size}</span>`, statusBadgeHtml(m.status)];
        if (m.hops) meta.push(`<span class="hop-trail">${hopTrailHtml(m.hops)}</span>`);
        return `
          <li class="message-item ${m.dir === 'out' ? 'is-out' : 'is-in'}">
            <div class="message-bubble">${m.tag ? `<strong>${m.tag}</strong><br>` : ''}${m.text}</div>
            <div class="message-meta">${meta.join('')}</div>
          </li>`;
      })
      .join('');
    refreshIcons();
  }

  function scrollChatToBottom() {
    const el = $('chatScroll');
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }

  function sendMessage(text) {
    const cfg = NETWORK_STATES[state.network];
    const msg = {
      id: `m-${Date.now()}`,
      dir: 'out',
      text,
      size: estimateSize(text),
      status: cfg.relayDirect ? (state.network === 'intermittent' ? 'queued' : 'transmitting') : 'queued',
      hops: null,
      time: Date.now(),
    };
    state.messages.push(msg);
    renderMessages();
    scrollChatToBottom();

    const path = relayPath();
    const timers = [];

    if (cfg.relayDirect && state.network !== 'intermittent') {
      timers.push([state.network === 'limited' ? 2200 : 900, () => {
        msg.status = 'delivered';
        renderMessages();
        onDelivered(msg, path);
      }]);
    } else if (state.network === 'intermittent') {
      timers.push([1300, () => { msg.status = 'transmitting'; renderMessages(); }]);
      timers.push([2300, () => { msg.status = 'delivered'; renderMessages(); onDelivered(msg, path); }]);
    } else {
      // offline — mesh relay
      timers.push([900, () => { msg.status = 'transmitting'; renderMessages(); }]);
      timers.push([1900, () => {
        msg.status = 'relayed';
        msg.hops = path;
        renderMessages();
        onDelivered(msg, path, true);
      }]);
    }

    let acc = 0;
    timers.forEach(([delay, fn]) => { acc = delay; setTimeout(fn, delay); });

    function onDelivered(message, p, viaMesh) {
      pushActivity(
        'message-square',
        'green',
        viaMesh ? `Message delivered — relayed via ${p.length - 2} node${p.length - 2 === 1 ? '' : 's'}` : 'Message delivered'
      );
      // simulate a short reply for demo continuity
      setTimeout(() => {
        const reply = INCOMING_REPLIES[Math.floor(Math.random() * INCOMING_REPLIES.length)];
        state.messages.push({
          id: `m-${Date.now()}-r`,
          dir: 'in',
          text: reply,
          size: estimateSize(reply),
          status: 'delivered',
          hops: viaMesh ? [...p].reverse() : null,
          time: Date.now(),
        });
        if (currentScreen === 'chat') { renderMessages(); scrollChatToBottom(); }
      }, 1100);
    }
  }

  $('composeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('composeInput');
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
    input.value = '';
  });

  /* ============================================================
     VOICE
     ============================================================ */

  let voicePressStart = 0;
  let voicePhaseState = 'idle';

  function setVoicePhase(label) {
    $('voicePhase').textContent = label;
  }

  function pttStart() {
    if (voicePhaseState !== 'idle') return;
    voicePhaseState = 'listening';
    voicePressStart = Date.now();
    const btn = $('pttButton');
    btn.classList.add('is-listening');
    $('waveform').classList.add('is-active');
    setVoicePhase('Listening…');
  }

  function pttEnd() {
    if (voicePhaseState !== 'listening') return;
    const duration = Math.max(600, Date.now() - voicePressStart);
    const btn = $('pttButton');
    btn.classList.remove('is-listening');
    $('waveform').classList.remove('is-active');
    voicePhaseState = 'processing';
    btn.classList.add('is-processing');
    setVoicePhase('Processing…');

    setTimeout(() => {
      btn.classList.remove('is-processing');
      btn.classList.add('is-transmitting');
      voicePhaseState = 'transmitting';
      setVoicePhase('Transmitting…');

      const cfg = NETWORK_STATES[state.network];
      const path = relayPath();
      const viaMesh = !cfg.relayDirect;

      setTimeout(() => {
        if (viaMesh) {
          setVoicePhase(`Relayed via ${path.length - 2} nodes`);
          setTimeout(finishVoice, 700);
        } else {
          finishVoice();
        }
      }, 700);

      function finishVoice() {
        btn.classList.remove('is-transmitting');
        voicePhaseState = 'idle';
        setVoicePhase('Delivered');

        state.voiceLog.unshift({
          duration: (duration / 1000).toFixed(1),
          hops: viaMesh ? path : null,
          time: Date.now(),
        });
        state.voiceLog = state.voiceLog.slice(0, 12);
        renderVoiceLog();
        pushActivity('mic', 'green', viaMesh ? `Voice message delivered — relayed via ${path.length - 2} nodes` : 'Voice message delivered');

        setTimeout(() => setVoicePhase('Hold to talk'), 1200);
      }
    }, 700);
  }

  const pttButton = $('pttButton');
  pttButton.addEventListener('pointerdown', (e) => { e.preventDefault(); pttStart(); });
  pttButton.addEventListener('pointerup', pttEnd);
  pttButton.addEventListener('pointerleave', pttEnd);
  pttButton.addEventListener('pointercancel', pttEnd);

  function renderVoiceLog() {
    const list = $('voiceLog');
    if (!state.voiceLog.length) {
      list.innerHTML = `<li class="list-empty">No transmissions yet</li>`;
      return;
    }
    list.innerHTML = state.voiceLog
      .map(
        (v) => `
        <li class="voice-log-item">
          <div class="voice-log-left">
            <span class="voice-log-icon"><i data-lucide="mic"></i></span>
            <div class="voice-log-meta">
              <span class="voice-log-title">${v.duration}s voice message</span>
              ${v.hops ? `<span class="hop-trail">${hopTrailHtml(v.hops)}</span>` : `<span class="activity-meta">Direct link</span>`}
            </div>
          </div>
          ${statusBadgeHtml('delivered')}
        </li>`
      )
      .join('');
    refreshIcons();
  }

  /* ============================================================
     NETWORK SCREEN
     ============================================================ */

  function renderNetworkScreen() {
    const path = relayPath();
    $('relayPathMeta').textContent = path.length > 2 ? `Relayed via ${path.length - 2} nodes` : 'Direct link';

    $('relayPath').innerHTML = path
      .map((id, i) => {
        const node = NODES.find((n) => n.id === id);
        const label = id === 'you' ? 'YOU' : node.name.toUpperCase();
        const iconMap = { you: 'user', f1: 'satellite-dish', f2: 'satellite-dish', base: 'server' };
        const link = i > 0 ? `<div class="relay-link is-active"></div>` : '';
        return `
          ${link}
          <div class="relay-node is-reachable ${id === 'you' ? 'is-you' : ''}">
            <span class="relay-dot"><i data-lucide="${iconMap[id]}"></i></span>
            <span class="relay-label">${label}</span>
          </div>`;
      })
      .join('');

    $('nodeList').innerHTML = NODES.map((n) => {
      const onPath = path.includes(n.id);
      return `
        <li class="node-item">
          <div class="node-info">
            <p class="node-name">${n.name}</p>
            <p class="node-status-text">${onPath ? 'On active relay path' : 'Connected · standby'}</p>
          </div>
          ${n.internet ? '<span class="node-badge tone-green">Internet</span>' : '<span class="node-badge">No internet</span>'}
        </li>`;
    }).join('');

    $('legendList').innerHTML = Object.values(NETWORK_STATES)
      .map(
        (cfg) => `
        <li class="legend-item">
          <p class="legend-item-label">${cfg.label}</p>
          <p class="legend-item-desc">${cfg.legend}</p>
        </li>`
      )
      .join('');

    refreshIcons();
  }

  /* ============================================================
     BROADCAST
     ============================================================ */

  $('openBroadcastSheet').addEventListener('click', () => openSheet('sheetBroadcast'));

  $('broadcastForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('broadcastInput');
    const text = input.value.trim();
    if (!text) return;
    closeAllSheets();
    showToast('Broadcasting…', 'default', 'radio-tower');

    setTimeout(() => {
      state.messages.push({
        id: `b-${Date.now()}`,
        dir: 'in',
        tag: 'Broadcast',
        text,
        size: estimateSize(text),
        status: 'delivered',
        hops: null,
        time: Date.now(),
      });
      if (currentScreen === 'chat') { renderMessages(); scrollChatToBottom(); }
      pushActivity('radio-tower', 'green', 'Broadcast delivered to all connected nodes');
      showToast('Broadcast delivered to network', 'green', 'check');
    }, 1200);

    input.value = '';
  });

  /* ============================================================
     EMERGENCY
     ============================================================ */

  function renderEmergencyGrid() {
    $('emergencyGrid').innerHTML = EMERGENCY_TYPES.map(
      (t) => `
      <button class="emergency-tile" data-type="${t.id}" data-label="${t.label}" type="button">
        <i data-lucide="${t.icon}"></i>
        <span>${t.label}</span>
      </button>`
    ).join('');
    refreshIcons();

    $('emergencyGrid').querySelectorAll('.emergency-tile').forEach((tile) => {
      tile.addEventListener('click', () => openEmergencyConfirm(tile.dataset.label));
    });
  }

  function openEmergencyConfirm(label) {
    pendingEmergency = label;
    $('emergencySheetTitle').textContent = `Send "${label}"?`;
    $('emergencySheetSub').textContent = 'This alerts every reachable node immediately.';
    openSheet('sheetEmergency');
  }

  $('sosButton').addEventListener('click', () => openEmergencyConfirm('SOS'));
  $('quickSOS').addEventListener('click', () => openEmergencyConfirm('SOS'));

  $('emergencyCancel').addEventListener('click', closeAllSheets);

  $('emergencyConfirm').addEventListener('click', () => {
    const label = pendingEmergency || 'SOS';
    closeAllSheets();
    showToast(`Sending "${label}"…`, 'red', 'triangle-alert');

    setTimeout(() => {
      state.alerts.unshift({ label, time: Date.now(), nodes: NODES.length });
      state.alerts = state.alerts.slice(0, 12);
      if (currentScreen === 'emergency') renderAlertLog();
      pushActivity('triangle-alert', 'red', `<b>${label}</b> delivered to ${NODES.length} nodes`);
      showToast(`"${label}" delivered to ${NODES.length} nodes`, 'green', 'check');
    }, 900);
  });

  function renderAlertLog() {
    const list = $('alertLog');
    if (!state.alerts.length) {
      list.innerHTML = `<li class="list-empty">No alerts sent</li>`;
      return;
    }
    list.innerHTML = state.alerts
      .map(
        (a) => `
        <li class="alert-item">
          <span class="alert-item-icon"><i data-lucide="triangle-alert"></i></span>
          <div>
            <p class="alert-item-text">${a.label}</p>
            <div class="alert-item-meta"><span>Delivered to ${a.nodes} nodes</span><span>·</span><span>${timeAgo(a.time)}</span></div>
          </div>
        </li>`
      )
      .join('');
    refreshIcons();
  }

  /* ============================================================
     BOOT
     ============================================================ */

  function boot() {
    $('broadcastNodeCount').textContent = NODES.length;
    $('nodeCount').textContent = NODES.length;
    renderEmergencyGrid();
    renderStatus();
    renderActivity();
    renderMessages();
    refreshIcons();
    showScreen('home');
  }

  boot();
})();