import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const titleRef = useRef(null);
    const objectRef = useRef(null);
    const severityRef = useRef(null);
    const statusRef = useRef(null);

    useEffect(() => {
        if (id) {
            loadItem();
        }
    }, [id]);

    async function loadItem() {
        try {
            const response = await axios.get(`https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items/${id}`);
            const item = response.data;

            if (titleRef.current) titleRef.current.value = item.title || "";
            if (objectRef.current) objectRef.current.value = item.object || "";
            if (severityRef.current) severityRef.current.value = item.severity || "Medium";
            if (statusRef.current) statusRef.current.value = item.status || "В процессе";

        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const itemData = {
            title: titleRef.current.value,
            object: objectRef.current.value,
            severity: severityRef.current.value,
            status: statusRef.current.value
        };


        if (id) {
            axios.put(`https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items/${id}`, JSON.stringify(itemData), {
                headers: { "Content-Type": "application/json" }
            })
            .then(() => {
                console.log("Запись обновлена");
                navigate('/');
            })
            .catch(error => console.error("Ошибка обновления:", error));
        } else {
            axios.post("https://69bada1cb3dcf7e0b4be41b7.mockapi.io/items", JSON.stringify(itemData), {
                headers: { "Content-Type": "application/json" }
            })
            .then(() => {
                console.log("Запись добавлена");
                navigate('/');
            })
            .catch(error => console.error("Ошибка создания:", error));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? "Редактирование протокола безопасности" : "Добавление протокола безопасности"}</h2>

            <label>
                Название протокола:
                <input
                    type="text"
                    ref={titleRef}
                    placeholder="Напр. Проверка доступа к базовой станции"
                />
            </label>

            <br /><br />

            <label>
                Объект связи:
                <input
                    type="text"
                    ref={objectRef}
                    placeholder="Напр. БС-102 / POP-1 / DC-1"
                />
            </label>

            <br /><br />

            <label>
                Критичность:
                <select ref={severityRef} defaultValue="Medium">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </label>

            <br /><br />

            <label>
                Статус:
                <select ref={statusRef} defaultValue="В процессе">
                    <option value="Завершено">Завершено</option>
                    <option value="В процессе">В процессе</option>
                    <option value="Обнаружены нарушения">Обнаружены нарушения</option>
                </select>
            </label>

            <br /><br />

            <button type="submit">
                {id ? "Сохранить изменения" : "Добавить"}
            </button>
        </form>
    );
};

export default Form;