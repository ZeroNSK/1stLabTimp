import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemById } from '../services/itemsApi';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemData, setItemData] = useState(null);
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
        setNotFound(true);
        setItemData(null);
        return;
      }

      setItemData(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setError('Не удалось загрузить данные протокола.');
      }
      setItemData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (notFound) {
    return (
      <div>
        <h1>Детальная информация о протоколе безопасности</h1>
        <p>Запись не найдена.</p>
        <button onClick={() => navigate('/')}>Назад к списку</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Детальная информация о протоколе безопасности</h1>

      <div style={{ marginBottom: '12px' }}>
        <div><b>ID:</b> {itemData.id}</div>
        <div><b>Название протокола:</b> {itemData.title}</div>
        <div><b>Объект связи:</b> {itemData.object}</div>
        <div><b>Критичность:</b> {itemData.severity}</div>
        <div><b>Статус:</b> {itemData.status}</div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')}>
          Назад к списку
        </button>

        <Link to={`/edit/${itemData.id}`}>
          <button style={{ marginLeft: '10px' }}>
            Редактировать
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Detail;