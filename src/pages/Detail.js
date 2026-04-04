import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getItemById } from '../services/itemsApi';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      setError('');
      setNotFound(false);

      const data = await getItemById(id);

      if (!data || !data.id) {
        setItem(null);
        setNotFound(true);
        return;
      }

      setItem(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError('Не удалось загрузить детали записи.');
      }

      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (notFound) {
  return (
    <div>
      <h1>404</h1>
      <p>HTTP Status Code: 404</p>
      <p>Запись не найдена.</p>
      <button type="button" onClick={() => navigate('/')}>
        Назад к списку
      </button>
    </div>
  );
}

  return (
    <div>
      <h1>Детальная информация</h1>

      <div style={{ marginBottom: '16px' }}>
        <div><b>ID:</b> {item.id}</div>
        <div><b>Название:</b> {item.title}</div>
        <div><b>Объект:</b> {item.object}</div>
        <div><b>Критичность:</b> {item.severity}</div>
        <div><b>Статус:</b> {item.status}</div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => navigate('/')}>
          Назад к списку
        </button>

        <Link to={`/edit/${item.id}`}>
          <button type="button">Редактировать</button>
        </Link>
      </div>
    </div>
  );
};

export default Detail;