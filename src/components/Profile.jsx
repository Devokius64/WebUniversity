import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserAvatar } from '../api/realApi';

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipField, setTooltipField] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Изображение не должно превышать 2MB');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const updatedUser = await updateUserAvatar(user.id, base64);
        setAvatar(base64);
        if (updateUser) {
          updateUser(updatedUser);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldMouseEnter = (fieldLabel, event) => {
    if (fieldLabel === 'Стипендия') {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX
      });
      setTooltipField(fieldLabel);
      setShowTooltip(true);
    }
  };

  const handleFieldMouseLeave = () => {
    setShowTooltip(false);
    setTooltipField(null);
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

  // Поля для студента (role === 'user')
  const studentFields = [
    { label: 'ФИО', value: user.fcs },
    { label: 'Логин', value: user.login },
    { label: 'Учебное подразделение', value: user.educational_department },
    { label: 'Форма обучения', value: user.study_mode },
    { label: 'Год обучения', value: `${user.course} курс` },
    { label: 'Группа', value: user.group },
    { label: 'Направление подготовки', value: user.study_direction },
    { label: 'Специализация', value: user.specialization },
    { label: 'Стипендия', value: user.scholarship },
    { label: 'Дата зачисления', value: user.entry_date }
  ];

  // Поля для преподавателя (role === 'teacher')
  const teacherFields = [
    { label: 'ФИО', value: user.fcs },
    { label: 'Логин', value: user.login },
    { label: 'Учебное подразделение', value: user.educational_department },
    { label: 'Ученая степень', value: user.academic_degree },
    { label: 'Ученое звание', value: user.academic_title },
    { label: 'Должность', value: user.post },
    { label: 'Преподаваемые предметы', value: user.teacherSubjects?.length || 0 }
  ];

  // Поля для администратора
  const adminFields = [
    { label: 'ФИО', value: user.fcs },
    { label: 'Логин', value: user.login },
    { label: 'Учебное подразделение', value: user.educational_department },
    { label: 'Роль', value: 'Администратор' }
  ];

  // Выбираем поля в зависимости от роли
  let fields = [];
  if (user.role === 'teacher') {
    fields = teacherFields;
  } else if (user.role === 'admin') {
    fields = adminFields;
  } else {
    fields = studentFields;
  }

  // Разбиваем поля на две колонки для студента
  const midIndex = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, midIndex);
  const rightFields = fields.slice(midIndex);

  // Компонент карточки поля с возможной подсказкой
  const FieldCard = ({ field }) => {
    const isScholarship = field.label === 'Стипендия';
    
    return (
      <div
        style={{
          backgroundColor: '#353535',
          borderRadius: '12px',
          padding: '14px 16px',
          transition: 'transform 0.2s, background-color 0.2s',
          cursor: isScholarship ? 'help' : 'default',
          position: 'relative'
        }}
        onMouseEnter={(e) => handleFieldMouseEnter(field.label, e)}
        onMouseLeave={handleFieldMouseLeave}
      >
        <div style={{
          fontSize: '11px',
          color: '#aaa',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {field.label}
          {isScholarship && <span style={{ fontSize: '12px' }}>❔</span>}
        </div>
        <div style={{
          fontSize: '15px',
          color: '#fff',
          fontWeight: '500',
          wordBreak: 'break-word'
        }}>
          {field.value || '—'}
        </div>
      </div>
    );
  };

  return (
    <div className="parent" style={{ paddingBottom: '80px' }}>
      <h2 style={{ color: '#fff', marginTop: '20px', textAlign: 'center' }}>Профиль</h2>
      
      <div className="child" style={{ marginTop: '20px', padding: '16px' }}>
        
        {/* Блок аватара */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginBottom: '30px' 
        }}>
          <div
            onClick={handleAvatarClick}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #852eff 0%, #5e1ab3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              border: '3px solid #dfe1e4',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Аватар"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span style={{ fontSize: '48px', color: '#fff' }}>
                {user.fcs?.charAt(0) || '?'}
              </span>
            )}
            {uploading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>⏳</span>
              </div>
            )}
          </div>
          <p style={{ 
            textAlign: 'center', 
            color: '#888', 
            fontSize: '12px', 
            marginTop: '12px',
            marginBottom: '0'
          }}>
            Нажмите на аватар, чтобы загрузить фото
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Карточки с информацией - сетка */}
        <div 
          className="profile-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: user.role === 'user' ? '1fr 1fr' : '1fr',
            gap: '12px',
            marginBottom: '20px',
            position: 'relative'
          }}
        >
          {/* Левая колонка */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(user.role === 'user' ? leftFields : fields).map((field, idx) => (
              <FieldCard key={idx} field={field} />
            ))}
          </div>

          {/* Правая колонка (только для студента) */}
          {user.role === 'user' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rightFields.map((field, idx) => (
                <FieldCard key={idx} field={field} />
              ))}
            </div>
          )}
        </div>

        {/* Всплывающая подсказка для стипендии */}
        {showTooltip && tooltipField === 'Стипендия' && (
          <div
            style={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              backgroundColor: '#333',
              color: '#ffcc00',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              maxWidth: '280px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              borderLeft: '4px solid #ffcc00',
              pointerEvents: 'none',
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }}
          >
            ⚠️ В случае отображения неверной информации необходимо обратиться в бухгалтерию
          </div>
        )}

        {/* Стили для мобильной адаптации */}
        <style>{`
          @media (max-width: 600px) {
            .profile-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Кнопка выхода */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '14px',
            backgroundColor: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#cc0000';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff4444';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}