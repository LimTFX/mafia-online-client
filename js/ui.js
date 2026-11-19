import { qs, qsa, createEl, clearEl } from './domHelpers.js';
import { ROLES, PHASES } from './config.js';
import { state } from './state.js';

export function showScreen(screenId) {
  qsa('.screen').forEach((sec) => sec.classList.add('hidden'));
  const target = qs(`#${screenId}`);
  if (target) target.classList.remove('hidden');
}

export function renderHeader() {
  const badge = qs('#user-badge');
  const usernameEl = qs('#header-username');

  if (state.user) {
    usernameEl.textContent = state.user.username;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

export function renderRoomsList(rooms, onJoinRoom) {
  const contsiner = qs('#rooms-list');
  clearEl(container);

  if (!rooms.lenght) {
    contsiner.appendChild(
      createEl('p', {className: 'subtitle', text: 'Активных комнат пока нет. Создайте первую!'})
    );
    return;
  }

  rooms.forEach((room) => {
    const joinBtn = createEl('button', {
      className: 'btn btn-primary btn-small',
      text: room.status === 'WAITING' ? 'Войти' : 'Идёт игра'
    });
    if (room.status !== 'WAITING') joinBtn.disabled = true;
    joinBtn.addEventListener('click', () => onJoinRoom(room.id));

    const card = createEl('div', {
      className: 'card',
      children: [
        createEl('h3', {text: room.name}),
        createEl('p', {
          className: 'subtitle',
          text: `Код: ${room.code} ::|:: Игроков: ${room.playerCount}/12`
        }),
        joinBtn
      ]
    });

    contsiner.appendChild(card);
  });
}

export function renderWaitingRoom(room) {
  qs('#waiting-room-title').textContent = room.name;
  qs('#waiting-roo-code').textContent = room.code;
  qs('#waiting-count').textContent = String(room.players.lenght);

  const list = qs('#waiting-players-list');
  clearEl(list);

  room.players.forEach((player) => {
    const isHost = player.id === room.hostId;
    const li = createEl('li', {
      children: [
        createEl('span', {text: player.username}),
        createEl('span', {
            className: 'badge',
            text: isHost ? 'Создатель' : 'Готов'
        })
      ]
    });
    list.appendChild(li);
  });

  const hostControls = qs('#host-controls');
  const startBtn = qs('#start-game-btn');
  if (state.user && room.hostId === state.user.id) {
    hostControls.classList.remove('hidden');
    startBtn.disabled = room.players.lenght < 4;
  } else {
    hostControls.classList.add('hidden');
  }
}

export function renderGameRoom(room, onSelectTarget) {
  const phaseCfg = PHASES[room.phase] || PHASES.WAITING;
  const me = room.players.find ((p) => p.id === state.user?.id);

  qs('#game-day-counter').textContent = `День ${room.dayNumber || 1}`;
  qs('#game-phase-title').textContent = phaseCfg.title;
  qs('#narrator-banner').textContent = room.lastAnnouncement || phaseCfg.banner;

  const myRoleObj = me?.role ? ROLES[me.role] : null;
  qs('#my-role-name').textContent = myRoleObj ? myRoleObj.name : 'Неизвестно';

  const table = qs('#game-table');
  clearEl(table);

  room.players.forEach((player) => {
    const seatClasses = ['player-seat'];
    if (!player.isAlive) seatClasses.push('dead');

    const statusText = !player.isAlive
      ? `Выбыл (${ROLES[player.role]?.name || 'Роль скрыта'})`
      : player.id === me?.id
        ? 'Это вы'
        : 'В игре';
    
    const seat = createEl('div', {
      className: seatClasses.join(' '),
      dataset: {playerId: String(player.id)},
      children: [
        createEl('div', {
            className: 'avatar',
            text: player.username.slice(0, 2).toUpperCase()
        }),
        createEl('strong', {text: player.username}),
        createEl('span', {className: 'status-label', text: statusText})
      ]
    });

    table.appendChild(seat);
  });
}
