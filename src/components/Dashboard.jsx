import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllNews } from '../api/realApi';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedNews, setExpandedNews] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Получаем текущую дату для приветствия
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Форматируем дату
  const formatDate = () => {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return now.toLocaleDateString('ru-RU', options);
  };

  // Форматируем дату новости
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Загружаем новости
  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getAllNews();
        setNews(data);
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      } finally {
        setLoadingNews(false);
      }
    };
    loadNews();
  }, []);

  const toggleNews = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  if (!user) {
    return (
      <div className="parent">
        <div className="child" style={{ marginTop: '20px', color: '#fff', textAlign: 'center' }}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent" style={{ paddingBottom: '80px' }}>
      {/* Приветствие */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>
          {getGreeting()}, {user.fcs?.split(' ')[0] || user.login}!
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px' }}>{formatDate()}</p>
      </div>

      {/* Блоки навигации */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', padding: '0 20px', marginBottom: '30px' }}>
        <div
          className="large-block"
          onClick={() => navigate('/schedule')}
          style={{
            flex: '1',
            minWidth: '200px',
            maxWidth: '300px',
            backgroundColor: '#2E69FF',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3 style={{ color: '#fff', margin: 0 }}>📅 Моё расписание</h3>
        </div>

        <div
          className="large-block"
          onClick={() => navigate('/lessons')}
          style={{
            flex: '1',
            minWidth: '200px',
            maxWidth: '300px',
            backgroundColor: '#2E69FF',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3 style={{ color: '#fff', margin: 0 }}>📚 Мои предметы</h3>
        </div>
      </div>

      {/* Новости (из БД) */}
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span> Актуальные новости
        </h3>
        {loadingNews ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>Загрузка новостей...</p>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {news.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#353535',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                {/* Заголовок новости (всегда виден) */}
                <div
                  style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: expandedNews === item.id ? '#404040' : 'transparent'
                  }}
                  onClick={() => toggleNews(item.id)}
                  onMouseEnter={(e) => {
                    if (expandedNews !== item.id) {
                      e.currentTarget.style.backgroundColor = '#404040';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (expandedNews !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>{item.title}</h4>
                    <span style={{ color: '#aaa', fontSize: '11px' }}>{formatNewsDate(item.date)}</span>
                  </div>
                </div>
                
                {/* Описание (выезжает снизу) */}
                <div
                  style={{
                    maxHeight: expandedNews === item.id ? '300px' : '0',
                    opacity: expandedNews === item.id ? 1 : 0,
                    transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    padding: '10px 20px 18px 20px',
                    borderTop: '1px solid #555'
                  }}>
                    <p style={{ 
                      color: '#cacaca', 
                      margin: 0, 
                      fontSize: '13px', 
                      lineHeight: '1.6'
                    }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Нет новостей</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}