import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createItem,
  getItemById,
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  updateItem,
  validateItem,
} from '../services/itemsApi';

const initialFormData = {
  title: '',
  object: '',
  severity: 'Medium',
  status: 'В процессе',
};

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setFormData(initialFormData);
      setLoading(false);
      setNotFound(false);
      setPageError('');
      return;
    }

    loadItem();
  }, [id, isEditMode]);

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
        title: item.title,
        object: item.object,
        severity: item.severity,
        status: item.status,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setPageError('Не удалось загрузить запись для редактирования.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setPageError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateItem(formData);
    setFieldErrors(validationErrors);
    setPageError('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await updateItem(id, formData);
      } else {
        await createItem(formData);
      }

      navigate('/');
    } catch (err) {
      if (err.validation) {
        setFieldErrors(err.validation);
        return;
      }

      if (err.response?.status === 404) {
        setNotFound(true);
        return;
      }

      setPageError(isEditMode ? 'Не удалось сохранить изменения.' : 'Не удалось сохранить запись.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (notFound) {
    return (
      <div>
        <h2>{isEditMode ? 'Редактирование записи' : 'Новая запись'}</h2>
        <p>Запись не найдена.</p>
      </div>
    );
  }
  if (notFound) {
  return (
    <div>
      <h2>404</h2>
      <p>HTTP Status Code: 404</p>
      <p>Запись не найдена.</p>
      <button type="button" onClick={() => navigate('/')}>
        Назад к списку
      </button>
    </div>
  );
}

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Редактирование записи' : 'Добавление записи'}</h2>

      {pageError && <p style={{ color: 'red' }}>{pageError}</p>}

      <div>
        <label htmlFor="title">Название</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          disabled={saving}
        />
        {fieldErrors.title && <p style={{ color: 'red' }}>{fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="object">Объект</label>
        <br />
        <input
          id="object"
          name="object"
          type="text"
          value={formData.object}
          onChange={handleChange}
          disabled={saving}
        />
        {fieldErrors.object && <p style={{ color: 'red' }}>{fieldErrors.object}</p>}
      </div>

      <div>
        <label htmlFor="severity">Severity</label>
        <br />
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          disabled={saving}
        >
          {SEVERITY_OPTIONS.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
        {fieldErrors.severity && <p style={{ color: 'red' }}>{fieldErrors.severity}</p>}
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <br />
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={saving}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {fieldErrors.status && <p style={{ color: 'red' }}>{fieldErrors.status}</p>}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          disabled={saving}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default Form;