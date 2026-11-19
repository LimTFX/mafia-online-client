import { qs } from './domHelpers.js';
import { state, loadSession, saveSession, clearSession } from './state.js';
import {
  showScreen,
  renderHeader,
  renderRoomsList,
  renderWaitingRoom,
  renderGameRoom
} from './ui.js';

// Временные моковые данные для проверки DOM-рендеринга (будут удалены при подключении API)
const MOCK_ROOM = {
  id: 1,
  name: 'Ночной клуб',
  code: '7492',
  status: 'PLAYING',
  hostId: 1,
  dayNumber: 1,
  phase: 'NIGHT_MAFIA',
  lastAnnouncement: 'Город засыпает. Просыпается Мафия и выбирает жертву...',
  players: [
    { id: 1, username: 'Алексей', role: 'MAFIA', isAlive: true },
    { id: 2, username: 'Мария', role: 'DOCTOR', isAlive: true },
    { id: 3, username: 'Дмитрий', role: 'DETECTIVE', isAlive: true },
    { id: 4, username: 'Елена', role: 'MISTRESS', isAlive: true },
    { id: 5, username: 'Иван', role: 'CIVILIAN', isAlive: false }
  ]
};

function handleSelectTarget(targetId) {
  state.selectedTargetId = targetId;
  renderGameRoom(state.currentRoom, handleSelectTarget);
}

function initMockPreview() {
  loadSession();

  if (!state.user) {
    showScreen('screen-auth');
  } else {
    renderHeader();
    state.currentRoom = MOCK_ROOM;
    showScreen('screen-game');
    renderGameRoom(state.currentRoom, handleSelectTarget);
  }

  qs('#auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = qs('#auth-username').value.trim();
    if (!username) return;
    saveSession('mock-token', { id: 1, username });
    renderHeader();
    renderRoomsList(
      [{ id: 1, name: 'Ночной клуб', code: '7492', status: 'WAITING', playerCount: 4 }],
      () => {
        state.currentRoom = MOCK_ROOM;
        showScreen('screen-waiting');
        renderWaitingRoom(state.currentRoom);
      }
    );
    showScreen('screen-lobby');
  });

  qs('#start-game-btn').addEventListener('click', () => {
    showScreen('screen-game');
    renderGameRoom(state.currentRoom, handleSelectTarget);
  });

  qs('#confirm-action-btn').addEventListener('click', () => {
    state.actionSubmitted = true;
    renderGameRoom(state.currentRoom, handleSelectTarget);
  });

  qs('#logout-btn').addEventListener('click', () => {
    clearSession();
    renderHeader();
    showScreen('screen-auth');
  });
}

document.addEventListener('DOMContentLoaded', initMockPreview);