import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Panel } from './components/Panel';
import { Dashboard } from './components/Dashboard';
import { Schedule } from './components/Schedule';
import { Profile } from './components/Profile';
import { Lessons } from './components/Lessons';
import { Help } from './components/Help';
import { AdminPanel } from './components/AdminPanel';
import { HelpBible } from './components/HelpBible';
import { HelpIITITS } from './components/HelpIITITS';
import { HelpOplatOU } from './components/HelpOplatOU';
import { HelpStudGorodok } from './components/HelpStudGorodok';
import { HelpCollege } from './components/HelpCollege';
import './index.css';
import './styles/main.css';
import './styles/defaults.css';
import './styles/contents.css';
import './styles/style.css';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  // Пока проверяем сессию — показываем загрузку
  if (loading) {
    return (
      <div className="parent">
        <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
          Загрузка...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Panel />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/help" element={<Help />} />
        <Route path="/help/bible" element={<HelpBible />} />
        <Route path="/help/iitits" element={<HelpIITITS />} />
        <Route path="/help/oplatou" element={<HelpOplatOU />} />
        <Route path="/help/studgorodok" element={<HelpStudGorodok />} />
        <Route path="/help/college" element={<HelpCollege />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}