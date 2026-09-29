import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
    } catch (error) {
      setLogoutError('The server could not be reached. Your browser session was still cleared.');
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Student System home">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>Student System</span>
      </a>
      <div className="topbar-actions">
        {logoutError && <span className="visually-hidden" role="status">{logoutError}</span>}
        <button className="logout-button" type="button" onClick={handleLogout}>
          Log out <span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
