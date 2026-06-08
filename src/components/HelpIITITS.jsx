import { useNavigate } from 'react-router-dom';

export function HelpIITITS() {
  const navigate = useNavigate();

  const instituteInfo = [
    { label: 'Почта', value: 'itct@rguk.ru' },
    { label: 'Телефон', value: '8 (495) 811-01-01, доб. 1069' },
    { label: 'Адрес', value: 'Малая Калужская, д. 1, каб. 1221' },
    { label: 'Режим работы', value: 'пн - пт с 10.00 до 17.00' }
  ];

  const employees = [
    {
      title: 'Директор института',
      name: 'Чикунов Иван Михайлович',
      img: '/images/заглушка.jpg'
    },
    {
      title: 'Заместитель директора',
      name: 'Королев Павел Александрович',
      img: '/images/заглушка.jpg'
    },
    {
      title: 'Заместитель директора',
      name: 'Макарова Наталья Александровна',
      img: '/images/заглушка.jpg'
    },
    {
      title: 'Секретарь (главный по доте)',
      name: 'Данько Денис Игоревич',
      img: '/images/заглушка.jpg'
    }
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
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Институт информационных технологий и цифровой трансформации
        </p>

        {/* Информация об институте */}
        <div className="child" style={{
          maxWidth: '600px',
          width: '100%',
          marginBottom: '20px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px'
          }}>
            <tbody>
              {/* Логотип / герб института */}
              <tr>
                <th colSpan="2" style={{
                  padding: '20px',
                  backgroundColor: '#2E69FF',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img 
                      src="/images/dzmqiIG66So.jpg" 
                      alt="Герб института"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '20%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }}>🏛️</div>
                  </div>
                </th>
              </tr>

              {instituteInfo.map((info, index) => (
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

              {/* Заголовок "Сотрудники" */}
              <tr>
                <th colSpan="2" style={{
                  padding: '20px 16px 10px 16px',
                  textAlign: 'start'
                }}>
                  <p style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '600' }}>Сотрудники:</p>
                  
                </th>
                
              </tr>
              
            </tbody>
            
          </table>
          {/* Карточки сотрудников */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          padding: '16px',
          justifyItems: 'center',
          alignItems: 'center'
        }}>
          {employees.map((employee, index) => (
            <div key={index} style={{
              backgroundColor: '#2E69FF',
              borderRadius: '16px',
              overflow: 'hidden',
              minWidth: '60%',
              maxWidth: '600px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px'
              }}>
                {/* Должность */}
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  {employee.title}
                </p>
                
                {/* Фото */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <img 
                    src={employee.img} 
                    alt={employee.name}
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
                  <div style={{ display: 'none', fontSize: '48px' }}>👤</div>
                </div>
                
                {/* Имя */}
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {employee.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>

        
      </div>
    </div>
  );
}