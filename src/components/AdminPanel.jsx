import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllSubjects, addSubject, deleteSubject,
  getAllGroups, getAllUsers, addUser
} from '../api/realApi';

export function AdminPanel() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('subjects');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Форма для предмета
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '', description: '' });
  
  // Форма для пользователя
  const [newUser, setNewUser] = useState({
    login: '', password: '', fcs: '', educational_department: '',
    study_mode: 'Очная', course: 1, group: '', study_direction: '',
    specialization: '', entry_date: new Date().toISOString().split('T')[0], role: 'user'
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'subjects') {
        const data = await getAllSubjects();
        setSubjects(data);
      } else if (activeTab === 'groups') {
        const data = await getAllGroups();
        setGroups(data);
      } else if (activeTab === 'users') {
        const data = await getAllUsers();
        setUsers(data);
      }
    } catch (error) {
      setMessage('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name) {
      setMessage('Введите название предмета');
      return;
    }
    try {
      await addSubject(newSubject);
      setNewSubject({ name: '', teacher: '', description: '' });
      await loadData();
      setMessage('Предмет добавлен');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка добавления');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (confirm('Удалить предмет?')) {
      try {
        await deleteSubject(id);
        await loadData();
        setMessage('Предмет удалён');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Ошибка удаления');
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.login || !newUser.password || !newUser.fcs || !newUser.group) {
      setMessage('Заполните обязательные поля (логин, пароль, ФИО, группа)');
      return;
    }
    try {
      await addUser(newUser);
      setNewUser({
        login: '', password: '', fcs: '', educational_department: '',
        study_mode: 'Очная', course: 1, group: '', study_direction: '',
        specialization: '', entry_date: new Date().toISOString().split('T')[0], role: 'user'
      });
      await loadData();
      setMessage('Пользователь добавлен');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.error || 'Ошибка добавления');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="parent">
        <div className="child" style={{ marginTop: '20px', color: '#fff', textAlign: 'center' }}>
          <p>Доступ запрещён. Только для администраторов.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent">
      <h2 style={{ color: '#fff', marginTop: '20px' }}>Панель администратора</h2>
      
      {/* Табы */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('subjects')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'subjects' ? '#2E69FF' : '#353535',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📚 Предметы
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'groups' ? '#2E69FF' : '#353535',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          👥 Группы
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'users' ? '#2E69FF' : '#353535',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          👤 Пользователи
        </button>
      </div>

      {/* Сообщения */}
      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#2E69FF',
          color: '#fff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {/* Вкладка: Предметы */}
      {activeTab === 'subjects' && (
        <div>
          {/* Форма добавления */}
          <div className="child" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>➕ Добавить предмет</h3>
            <form onSubmit={handleAddSubject}>
              <input
                type="text"
                placeholder="Название предмета *"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="text"
                placeholder="Преподаватель"
                value={newSubject.teacher}
                onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <textarea
                placeholder="Описание"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', minHeight: '60px' }}
              />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2E69FF', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Добавить
              </button>
            </form>
          </div>

          {/* Список предметов */}
          <div className="child" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>📖 Список предметов</h3>
            {loading ? (
              <p style={{ color: '#aaa' }}>Загрузка...</p>
            ) : (
              subjects.map(subject => (
                <div key={subject.id} style={{
                  backgroundColor: '#353535',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ color: '#fff', margin: '0 0 5px 0', fontWeight: 'bold' }}>{subject.name}</p>
                    <p style={{ color: '#aaa', margin: '0', fontSize: '12px' }}>{subject.teacher} {subject.description && `• ${subject.description}`}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Вкладка: Группы */}
      {activeTab === 'groups' && (
        <div className="child" style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>📌 Список групп</h3>
          {loading ? (
            <p style={{ color: '#aaa' }}>Загрузка...</p>
          ) : (
            groups.map(group => (
              <div key={group} style={{
                backgroundColor: '#353535',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <p style={{ color: '#fff', margin: 0 }}>{group}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Вкладка: Пользователи */}
      {activeTab === 'users' && (
        <div>
          {/* Форма добавления */}
          <div className="child" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>➕ Добавить пользователя</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Логин *"
                value={newUser.login}
                onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="password"
                placeholder="Пароль *"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="text"
                placeholder="ФИО *"
                value={newUser.fcs}
                onChange={(e) => setNewUser({ ...newUser, fcs: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="text"
                placeholder="Группа *"
                value={newUser.group}
                onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="text"
                placeholder="Учебное подразделение"
                value={newUser.educational_department}
                onChange={(e) => setNewUser({ ...newUser, educational_department: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <input
                type="text"
                placeholder="Направление подготовки"
                value={newUser.study_direction}
                onChange={(e) => setNewUser({ ...newUser, study_direction: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none' }}
              >
              <option value="user">Студент</option>
              <option value="teacher">Преподаватель</option>
              <option value="admin">Администратор</option>
              </select>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2E69FF', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Добавить
              </button>
            </form>
          </div>

          {/* Список пользователей */}
          <div className="child" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>👥 Список пользователей</h3>
            {loading ? (
              <p style={{ color: '#aaa' }}>Загрузка...</p>
            ) : (
              users.map(user => (
                <div key={user.id} style={{
                  backgroundColor: '#353535',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <p style={{ color: '#fff', margin: '0 0 5px 0' }}><strong>{user.fcs}</strong> ({user.login})</p>
                  <p style={{ color: '#aaa', margin: 0, fontSize: '12px' }}>Группа: {user.group} • Роль: {user.role}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}