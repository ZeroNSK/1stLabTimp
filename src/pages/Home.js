import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteItemById, getItems } from '../services/itemsApi';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError('');
      setDeleteError('');

      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Не удалось загрузить список.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeletingId(id);
      setDeleteError('');

      await deleteItemById(id);

      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setDeleteError('Не удалось удалить запись.');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <div>
      <h1>Протоколы безопасности в сфере связи и телекоммуникаций</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/add">Добавить протокол</Link>
      </div>

      {loading && <p>Загрузка списка...</p>}

      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

      {!loading && !error && items.length === 0 && <p>Список пуст.</p>}

      {!loading && !error && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/detail/${item.id}`}>{item.title}</Link>

              <div>Объект: {item.object}</div>
              <div>Уровень критичности: {item.severity}</div>
              <div>Статус: {item.status}</div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <Link to={`/edit/${item.id}`}>Редактировать</Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? 'Удаление...' : 'Удалить'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;