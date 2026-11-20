import { API_BASE_URL } from './config.js';
import { state } from './state.js';

async function request(endpoint, option = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...option,
    headers: { ...headers, ...(option.headers || {}) }
  });

  const data = await res.json();
  if(!res.ok) {
    throw new Error(data.error || 'Ошибка запроса');
  }
  
  return data;
}

export const api = {};