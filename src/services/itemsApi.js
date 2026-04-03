import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items';

export const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
export const STATUS_OPTIONS = ['Завершено', 'В процессе', 'Обнаружены нарушения'];

function normalizeSeverity(value) {
  return SEVERITY_OPTIONS.includes(value) ? value : 'Medium';
}

function normalizeStatus(value) {
  return STATUS_OPTIONS.includes(value) ? value : 'В процессе';
}

export function normalizeItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  return {
    id: String(item.id ?? ''),
    title: String(item.title ?? '').trim(),
    object: String(item.object ?? '').trim(),
    severity: normalizeSeverity(item.severity),
    status: normalizeStatus(item.status),
  };
}

export function validateItem(item) {
  const errors = {};

  if (!item.title || !item.title.trim()) {
    errors.title = 'Заполни название.';
  }

  if (!item.object || !item.object.trim()) {
    errors.object = 'Заполни объект.';
  }

  if (!SEVERITY_OPTIONS.includes(item.severity)) {
    errors.severity = 'Выбери допустимую severity.';
  }

  if (!STATUS_OPTIONS.includes(item.status)) {
    errors.status = 'Выбери допустимый status.';
  }

  return errors;
}

function buildPayload(item) {
  return {
    title: String(item.title ?? '').trim(),
    object: String(item.object ?? '').trim(),
    severity: normalizeSeverity(item.severity),
    status: normalizeStatus(item.status),
  };
}

export async function getItems() {
  const response = await axios.get(API_URL);
  const items = Array.isArray(response.data) ? response.data : [];
  return items.map(normalizeItem).filter(Boolean);
}

export async function getItemById(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return normalizeItem(response.data);
}

export async function createItem(itemData) {
  const payload = buildPayload(itemData);
  const errors = validateItem(payload);

  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed');
    error.validation = errors;
    throw error;
  }

  const response = await axios.post(API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return normalizeItem(response.data);
}

export async function updateItem(id, itemData) {
  const payload = buildPayload(itemData);
  const errors = validateItem(payload);

  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed');
    error.validation = errors;
    throw error;
  }

  const response = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return normalizeItem(response.data);
}

export async function deleteItemById(id) {
  await axios.delete(`${API_URL}/${id}`);
  return id;
}