import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import './App.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Страница не найдена</h1>
        <p className="not-found-text">
          Такой страницы нет. Проверь адрес или вернись на главную.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-link primary-link">
            На главную
          </Link>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;