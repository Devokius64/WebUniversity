import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSubjects, getTeacherSubjects, updateSubject } from '../api/realApi';

export function Lessons() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', teacher: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadSubjects = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      let data;
      if (user?.role === 'teacher') {
        data = await getTeacherSubjects(user.id);
      } else {
        data = await getAllSubjects();
      }
      setSubjects(data);
    } catch (error) {
      console.error('Ошибка загрузки предметов:', error);
      setError('Не удалось загрузить предметы');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleRefresh = () => {
    loadSubjects(true);
  };

  const toggleSubject = (id) => {
    if (editingSubject) {
      setEditingSubject(null);
    }
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const startEditing = (subject) => {
    setEditingSubject(subject.id);
    setEditForm({
      name: subject.name,
      teacher: subject.teacher,
      description: subject.description || ''
    });
  };

  const cancelEditing = () => {
    setEditingSubject(null);
    setEditForm({ name: '', teacher: '', description: '' });
  };

  const saveSubject = async (subjectId) => {
    setSaving(true);
    try {
      await updateSubject(subjectId, editForm);
      setSubjects(prev => prev.map(sub => 
        sub.id === subjectId 
          ? { ...sub, ...editForm }
          : sub
      ));
      setEditingSubject(null);
      setExpandedSubject(null);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="parent">
        <div style={{ marginTop: '20px', color: '#fff', textAlign: 'center', alignItems: 'center' }}>
          <p>Загрузка предметов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent" style={{ paddingBottom: '80px' }}>
      {/* Заголовок и кнопка обновления */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 20px',
        marginTop: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ color: '#fff', margin: 0 }}>
          {user?.role === 'teacher' ? 'Мои предметы' : 'Предметы'}
        </h2>
      </div>

      {/* Ошибка */}
      {error && (
        <div style={{ padding: '0 20px', marginTop: '15px' }}>
          <div style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        </div>
      )}

      {/* Список предметов (аккордеон) */}
      <div style={{ padding: '0 20px', marginTop: '20px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              style={{
                backgroundColor: '#353535',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              {/* Заголовок предмета */}
              <div
                style={{
                  padding: '18px 20px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  backgroundColor: expandedSubject === subject.id ? '#404040' : 'transparent'
                }}
                onClick={() => toggleSubject(subject.id)}
                onMouseEnter={(e) => {
                  if (expandedSubject !== subject.id) {
                    e.currentTarget.style.backgroundColor = '#404040';
                  }
                }}
                onMouseLeave={(e) => {
                  if (expandedSubject !== subject.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>📖</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>{subject.name}</h3>
                  </div>
                  <span style={{ 
                    color: '#aaa', 
                    fontSize: '20px',
                    transition: 'transform 0.3s',
                    transform: expandedSubject === subject.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
              </div>
              
              {/* Описание (выезжает снизу) */}
              <div
                style={{
                  maxHeight: expandedSubject === subject.id ? (editingSubject === subject.id ? '' : '200px') : '0',
                  opacity: expandedSubject === subject.id ? 1 : 0,
                  transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  padding: '10px 20px 18px 20px',
                  borderTop: '1px solid #555'
                }}>
                  {editingSubject === subject.id ? (
                    // Режим редактирования
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block'}}>
                          Название предмета
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#2B2B2B',
                            color: '#fff'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                          Преподаватель
                        </label>
                        <input
                          type="text"
                          value={editForm.teacher}
                          onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#2B2B2B',
                            color: '#fff'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                          Описание
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows="3"
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#2B2B2B',
                            color: '#fff',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button
                          onClick={() => saveSubject(subject.id)}
                          disabled={saving}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: saving ? 'wait' : 'pointer'
                          }}
                        >
                          {saving ? 'Сохранение...' : '💾 Сохранить'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#555',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Режим просмотра
                    <div>
                      <p style={{ color: '#cacaca', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                        <strong style={{ color: '#fff' }}>Преподаватель:</strong> {subject.teacher}
                      </p>
                      {subject.description && (
                        <p style={{ color: '#cacaca', margin: '10px 0 0 0', fontSize: '14px', lineHeight: '1.6' }}>
                          <strong style={{ color: '#fff' }}>Описание:</strong> {subject.description}
                        </p>
                      )}
                      
                      {/* Кнопка редактирования для преподавателя */}
                      {user?.role === 'teacher' && (
                        <button
                          onClick={() => startEditing(subject)}
                          style={{
                            marginTop: '15px',
                            padding: '8px 16px',
                            backgroundColor: '#2E69FF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e4fcc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2E69FF'}
                        >
                          ✏️ Редактировать
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && !error && (
          <div className="large-block" style={{ 
            padding: '40px', 
            color: '#aaa', 
            textAlign: 'center',
            borderRadius: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📭</span>
            <p>
              {user?.role === 'teacher' 
                ? 'У вас пока нет закреплённых предметов' 
                : 'Нет добавленных предметов'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}