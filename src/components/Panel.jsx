import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function Panel() {
  return (
    <>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <main style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#2B2B2B',
        paddingBottom: '100px'
      }}>
        <Outlet />
      </main>
      <Navigation />
    </div>
      
    </>
  );
}
