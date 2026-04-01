import axios from 'axios';

const API_URL = 'https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items';

export async function getItems() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getItemById(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createItem(itemData) {
  const response = await axios.post(API_URL, itemData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

export async function updateItem(id, itemData) {
  const response = await axios.put(`${API_URL}/${id}`, itemData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

export async function deleteItemById(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}