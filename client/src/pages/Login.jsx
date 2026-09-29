import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = token.trim();
    if (!value) {
      setError('Enter an auth token to continue.');
      return;
    }

    localStorage.setItem('authToken', value);
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="brand-mark login-mark" aria-hidden="true">S</div>
        <p className="eyebrow">STUDENT SYSTEM</p>
        <h1 id="login-title">Welcome back.</h1>
        <p className="login-copy">Sign in with a token from your authentication provider.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-token">Authentication token</label>
          <input
            id="auth-token"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            aria-describedby={error ? 'token-error' : undefined}
          />
          {error && <p className="form-error" id="token-error" role="alert">{error}</p>}
          <button className="submit-button" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
      </section>
      <aside className="login-aside" aria-hidden="true">
        <div className="aside-rule" />
        <p>LEARNING, ORGANIZED.</p>
        <span>01 / 01</span>
      </aside>
    </main>
  );
}

export default Login;
