import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItem, getItemById, updateItem } from '../services/itemsApi';

const allowedSeverities = ['Low', 'Medium', 'High', 'Critical'];
const allowedStatuses = ['Завершено', 'В процессе', 'Обнаружены нарушения'];

const initialFormData = {
  title: '',
  object: '',
  severity: 'Medium',
  status: 'В процессе'
};

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      setPageError('');
      setNotFound(false);

      const item = await getItemById(id);

      if (!item || !item.id) {
        setNotFound(true);
        return;
      }

      setFormData({
        title: item.title || '',
        object: item.object || '',
        severity: item.severity || 'Medium',
        status: item.status || 'В процессе'
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setPageError('Не удалось загрузить данные для редактирования.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  }

  function validate(data) {
    const errors = {};

    if (!data.title.trim()) {
      errors.title = 'Заполни название протокола.';
    }

    if (!data.object.trim()) {
      errors.object = 'Заполни объект связи.';
    }

    if (!allowedSeverities.includes(data.severity)) {
      errors.severity = 'Выбери допустимый уровень критичности.';
    }

    if (!allowedStatuses.includes(data.status)) {
      errors.status = 'Выбери допустимый статус.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(formData);
    setFieldErrors(validationErrors);
    setPageError('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await updateItem(id, formData);
      } else {
        await createItem(formData);
      }

      navigate('/');
    } catch (err) {
      setPageError(id
        ? 'Не удалось сохранить изменения.'
        : 'Не удалось создать запись.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && id) {
    return <p>Загрузка формы...</p>;
  }

  if (notFound) {
    return <p>Запись не найдена.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {id ? 'Редактирование протокола безопасности' : 'Добавление протокола безопасности'}
      </h2>

      {pageError && <p style={{ color: 'red' }}>{pageError}</p>}

      <label>
        Название протокола:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Напр. Проверка доступа к базовой станции"
        />
      </label>
      {fieldErrors.title && <p style={{ color: 'red' }}>{fieldErrors.title}</p>}

      <br /><br />

      <label>
        Объект связи:
        <input
          type="text"
          name="object"
          value={formData.object}
          onChange={handleChange}
          placeholder="Напр. БС-102 / POP-1 / DC-1"
        />
      </label>
      {fieldErrors.object && <p style={{ color: 'red' }}>{fieldErrors.object}</p>}

      <br /><br />

      <label>
        Критичность:
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </label>
      {fieldErrors.severity && <p style={{ color: 'red' }}>{fieldErrors.severity}</p>}

      <br /><br />

      <label>
        Статус:
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Завершено">Завершено</option>
          <option value="В процессе">В процессе</option>
          <option value="Обнаружены нарушения">Обнаружены нарушения</option>
        </select>
      </label>
      {fieldErrors.status && <p style={{ color: 'red' }}>{fieldErrors.status}</p>}

      <br /><br />

      <button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : id ? 'Сохранить изменения' : 'Добавить'}
      </button>
    </form>
  );
};

export default Form;