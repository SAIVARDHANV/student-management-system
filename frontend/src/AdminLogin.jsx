import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!emailPattern.test(email.trim()) || !password) {
      setError("Enter a valid email address and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Unable to sign in. Check your credentials.");
        return;
      }

      setSession({ ...result.admin, token: result.token });
      setPassword("");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card admin-login-card">
      <h1>Admin Login</h1>
      {session ? (
        <div className="admin-session" role="status">
          <p>Signed in as <strong>{session.email}</strong></p>
          <button type="button" onClick={() => setSession(null)}>
            Sign out
          </button>
        </div>
      ) : (
        <>
          <p className="admin-login-intro">Sign in with an administrator account.</p>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="admin-email">Email</label>
            <input
              autoComplete="username"
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              aria-invalid={Boolean(error)}
              disabled={loading}
            />
            <label htmlFor="admin-password">Password</label>
            <input
              autoComplete="current-password"
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
            {error && <p className="error" role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export default AdminLogin;
