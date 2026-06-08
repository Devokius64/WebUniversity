import { useNavigate } from 'react-router-dom';

export function Help() {
  const navigate = useNavigate();

  const helpItems = [
    {
      title: 'Библиотека',
      path: '/help/bible'
    },
    {
      title: 'Институт: ИТиЦТ',
      path: '/help/iitits'
    },
    {
      title: 'Отдел платных образовательных услуг',
      path: '/help/oplatou'
    },
    {
      title: 'Студенческий городок',
      path: '/help/studgorodok'
    },
    {
      title: 'Колледж',
      path: '/help/college'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="parent">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '600',
            margin: '20px 0'
          }}>
            Справка
          </h3>
        </div>

        {/* Блоки справки */}
        {helpItems.map((item, index) => (
          <div
            key={index}
            className="small-block"
            onClick={() => handleNavigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '12px 16px',
              width: '288px',
              minHeight: '64px',
              flexShrink: 0,
              borderRadius: '15px',
              border: '4px solid #1847C1',
              background: '#2E69FF',
              boxShadow: '0px 4px 4px 0px rgba(24, 71, 193, 0.25)',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <p style={{
              textAlign: 'center',
              margin: 0,
              padding: '0 12px',
              fontWeight: '500'
            }}>
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}