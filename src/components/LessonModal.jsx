import { useState, useEffect } from 'react';
import { getStudentsByGroup, getAttendanceForLesson, saveAttendanceForLesson } from '../api/realApi';

export function LessonModal({ lecture, groupName, userRole, onClose, onAttendanceUpdate }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [originalAttendance, setOriginalAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userRole === 'teacher' && groupName && lecture) {
      loadStudentsAndAttendance();
    }
  }, [groupName, lecture]);

  const loadStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const studentsList = await getStudentsByGroup(groupName);
      setStudents(studentsList);
      
      const savedAttendance = await getAttendanceForLesson(groupName, lecture.day, lecture.id);
      
      const att = {};
      studentsList.forEach(student => {
        att[student.id] = savedAttendance[student.id] || false;
      });
      
      setAttendance(att);
      setOriginalAttendance(att);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAttendanceForLesson(groupName, lecture.day, lecture.id, attendance);
      
      if (onAttendanceUpdate) {
        onAttendanceUpdate();
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении отметок');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAttendance(originalAttendance);
    onClose();
  };

  const hasChanges = () => {
    return JSON.stringify(attendance) !== JSON.stringify(originalAttendance);
  };

  // Функция для получения инициала
  const getInitial = (fcs) => {
    if (!fcs) return '?';
    const parts = fcs.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return fcs.charAt(0);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={handleCancel}>
      <div style={{
        backgroundColor: '#2B2B2B',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        padding: '20px',
        color: '#fff'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Заголовок */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, color: '#2E69FF' }}>{lecture.name}</h3>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#aaa' }}>
            {lecture.timeStart} - {lecture.timeEnd} | Ауд. {lecture.class}
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#7d7d7d' }}>
            {lecture.lector}
          </p>
          {userRole === 'teacher' && groupName && (
            <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#2E69FF' }}>
              📚 Группа: {groupName}
            </p>
          )}
        </div>

        {/* Студент: информация о предмете */}
        {userRole === 'user' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Описание:</strong>
              <p style={{ color: '#aaa', marginTop: '5px' }}>
                {lecture.description || 'Нет описания'}
              </p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Преподаватель:</strong>
              <p style={{ color: '#aaa', marginTop: '5px' }}>
                {lecture.teacherFullName || lecture.lector}
              </p>
            </div>
            <div>
              <strong>Аудитория:</strong>
              <p style={{ color: '#aaa', marginTop: '5px' }}>{lecture.class}</p>
            </div>
          </div>
        )}

        {/* Преподаватель: список студентов */}
        {userRole === 'teacher' && (
          <div>
            <h4 style={{ marginBottom: '15px' }}>Список присутствия студентов</h4>
            {loading ? (
              <p style={{ color: '#aaa' }}>Загрузка...</p>
            ) : (
              students.map(student => (
                <div key={student.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderBottom: '1px solid #444',
                  backgroundColor: '#353535',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Мини-аватар */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: student.avatar ? 'transparent' : '#2025a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt="Аватар"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>
                          {getInitial(student.fcs)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{student.fcs}</div>
                      <div style={{ fontSize: '11px', color: '#aaa' }}>{student.group}</div>
                    </div>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={attendance[student.id] || false}
                      onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Кнопки для преподавателя */}
        {userRole === 'teacher' ? (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: hasChanges() ? '#2E69FF' : '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: hasChanges() && !saving ? 'pointer' : 'default',
                fontSize: '14px',
                opacity: hasChanges() ? 1 : 0.5
              }}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#2E69FF',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
}