import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

let data = [];

async function loadData() {
  try {
    const response = await axios.get("https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items");
    data = response.data;
    console.log("Данные загружены:", data);
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
}

await loadData();
function deleteItem(id) {
  axios.delete(`https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items/${id}`)
    .then(() => {
      console.log(`Запись ${id} удалена`);
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
    
            <Link to={`/detail/${item.id}`}>
              {item.title || item.name}
            </Link>

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