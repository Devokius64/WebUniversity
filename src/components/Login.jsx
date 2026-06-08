import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/realApi';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(login, password);
      setAuthUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userLogin, userPassword) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await loginUser(userLogin, userPassword);
      setAuthUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#2B2B2B',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <img src="/images/Group.svg" alt="Логотип" style={{
          width: '100px',
          height: '100px',
          marginBottom: '30px'
        }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            className="text-input"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={loading}
            style={{ padding: '12px' }}
          />
          <input
            type="password"
            className="text-input"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ padding: '12px' }}
          />
          <button
            type="submit"
            className="text-input"
            disabled={loading}
            style={{
              cursor: loading ? 'wait' : 'pointer',
              padding: '12px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Загрузка...' : 'Вход'}
          </button>
          {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
        </form>

        {/* Быстрый вход для демонстрации */}
        <div style={{ marginTop: '30px' }}>
          <p style={{ color: '#7D7D7D', fontSize: '12px', marginBottom: '15px' }}>
            —— Быстрый вход для демонстрации ——
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => quickLogin('ivanov', '123456')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#2E69FF',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'wait' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🎓 Студент
            </button>
            <button
              onClick={() => quickLogin('tutor', '123')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'wait' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              👨‍🏫 Преподаватель
            </button>
          </div>
        </div>

        <footer style={{ marginTop: '40px', color: '#7D7D7D', fontSize: '12px' }}>
          <p>Мобильное приложение для университета Косыгина</p>
        </footer>
      </div>
    </div>
  );
}