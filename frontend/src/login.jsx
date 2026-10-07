import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/students/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.non_field_errors?.[0] ||
          "Invalid email or password."
        );
        return;
      }

      setMessage(`Welcome ${data.name}!`);
      setLoggedIn(true);

    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/students/logout/",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setLoggedIn(false);
        setMessage("Logout successful.");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Unable to logout.");
    }
  };

  if (loggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h1>Student Dashboard</h1>

          <p className="success">
            {message}
          </p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">

        <h1>Student Login</h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;