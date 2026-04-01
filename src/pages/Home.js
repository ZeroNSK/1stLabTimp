import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItemById } from '../services/itemsApi';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError('');
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Не удалось загрузить список протоколов.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeleteError('');
      await deleteItemById(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setDeleteError('Не удалось удалить запись.');
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

      {!loading && !error && items.length === 0 && (
        <p>Список пуст.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <Link to={`/detail/${item.id}`}>
                {item.title}
              </Link>

              <div>Объект: {item.object}</div>
              <div>Уровень критичности: {item.severity}</div>
              <div>Статус: {item.status}</div>

              <button
                onClick={() => handleDelete(item.id)}
                style={{ marginTop: '10px' }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;