import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

let data = []; // Обычная переменная для хранения данных

// Функция для загрузки данных
async function loadData() {
  try {
    const response = await axios.get("http://localhost:5001/items");
    data = response.data;
    console.log("Данные загружены:", data);
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
}

// Загружаем данные перед рендером
await loadData();

// Функция для удаления товара
function deleteItem(id) {
  axios.delete(`http://localhost:5001/items/${id}`)
    .then(() => {
      console.log(`Запись ${id} удалена`);
      // Удаляем элемент из списка вручную
      data = data.filter(item => item.id !== id);
      console.log("Обновленные данные:", data);
    })
    .catch(error => console.error("Ошибка удаления:", error));
}

const Home = () => {
  return (
    <div>
      <h1>Протоколы безопасности в сфере связи и телекоммуникаций</h1>

      <ul>
        {data.map(item => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            
            {/* Если есть новое поле title — используем его */}
            <Link to={`/detail/${item.id}`}>
              {item.title || item.name}
            </Link>

            {/* Добавляем отображение новых полей (если они есть) */}
            {item.object && (
              <div>
                Объект: {item.object}
              </div>
            )}

            {item.severity && (
              <div>
                Уровень критичности: {item.severity}
              </div>
            )}

            {item.status && (
              <div>
                Статус: {item.status}
              </div>
            )}

            <button 
              onClick={() => deleteItem(item.id)} 
              style={{ marginLeft: "10px" }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <Link to="/add">Добавить протокол</Link>
    </div>
  );
};

export default Home;