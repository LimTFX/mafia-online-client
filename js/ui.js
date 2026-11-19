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
        clearEl('p', {
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

