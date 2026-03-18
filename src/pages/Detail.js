import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);

  async function loadItem() {
    try {
      const response = await axios.get(`https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items/${id}`);
      setItemData(response.data);
      console.log("Загруженный протокол:", response.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  }

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!itemData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Детальная информация о протоколе безопасности</h1>

      <div style={{ marginBottom: "12px" }}>
        <div><b>ID:</b> {itemData.id}</div>

        {itemData.title && (
          <div>
            <b>Название протокола:</b> {itemData.title}
          </div>
        )}

        {itemData.object && (
          <div>
            <b>Объект связи:</b> {itemData.object}
          </div>
        )}

        {itemData.severity && (
          <div>
            <b>Критичность:</b> {itemData.severity}
          </div>
        )}

        {itemData.status && (
          <div>
            <b>Статус:</b> {itemData.status}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/")}>
          Назад к списку
        </button>

        <Link to={`/edit/${itemData.id}`}>
          <button style={{ marginLeft: "10px" }}>
            Редактировать
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Detail;