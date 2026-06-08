import { useNavigate } from 'react-router-dom';

export function HelpBible() {
  const navigate = useNavigate();

  const libraryInfo = [
    { label: 'Почта', value: 'biblio@rguk.ru' },
    { label: 'Телефон', value: '8 (495) 811-01-01 доб. 1153' },
    { label: 'Адрес', value: 'Имущественный комплекс "Малая Калужская", Учебный корпус №1, Малая Калужская улица, д. 1, стр. 3' }
  ];

  return (
    <div className="parent">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px'
      }}>
        {/* Кнопка назад */}
        <button
          onClick={() => navigate('/help')}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#666'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555'}
        >
          ← Назад
        </button>

        {/* Заголовок */}
        <p style={{
          color: '#FFFFFF',
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Библиотека
        </p>

        {/* Карточка заведующей */}
        <div style={{
          backgroundColor: '#2E69FF',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '400px',
          width: '100%',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
          }}>
            {/* Фото */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <img 
                src="/images/заглушка.jpg" 
                alt="Недбаевская Нина Петровна"
                style={{
                  width: '105px',
                  height: '125px',
                  borderRadius: '20%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', fontSize: '48px' }}>📚</div>
            </div>
            
            {/* Имя */}
            <p style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '500',
              margin: 0,
              textAlign: 'center'
            }}>
              Недбаевская Нина Петровна
            </p>
          </div>
        </div>

        {/* Информация о библиотеке */}
        <div className="child" style={{
          maxWidth: '600px',
          width: '100%'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px'
          }}>
            <tbody>
              {libraryInfo.map((info, index) => (
                <tr key={index}>
                  <th style={{
                    padding: '12px 16px',
                    fontSize: 'clamp(10pt, 2vw, 14pt)',
                    backgroundColor: '#2E69FF',
                    color: '#FFFFFF',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                    textAlign: 'start',
                    width: '35%'
                  }}>
                    <p style={{ margin: 0, textAlign: 'start' }}>{info.label}</p>
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    fontSize: 'clamp(10pt, 2vw, 14pt)',
                    backgroundColor: '#2E69FF',
                    color: '#FFFFFF',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    textAlign: 'start'
                  }}>
                    <p style={{ margin: 0, textAlign: 'start', wordBreak: 'break-word' }}>{info.value}</p>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}