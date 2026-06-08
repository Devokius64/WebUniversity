import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/profile', label: 'Профиль', icon: 'fa-user' },
    { path: '/schedule', label: 'Расписание', icon: 'fa-calendar' },
    { path: '/', label: 'Главная', icon: 'fa-house' },
    { path: '/lessons', label: 'Предметы', icon: 'fa-book' },
    { path: '/help', label: 'Справка', icon: 'fa-question-circle' }
  ];

  // Добавляем админку, если пользователь админ
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Админ', icon: 'fa-gear' });
  }

  return (
    <div className="centeredNav_2">
      <nav className="centeredNav">
        <ul>
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`noselect ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <p>{item.label}</p>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}