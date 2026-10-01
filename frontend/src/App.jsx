import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    student_id: "",
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    course: "",
    year: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.phone.length !== 10) {
      setError("Phone number must contain 10 digits.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/students/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            year: Number(form.year),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(JSON.stringify(data));
        return;
      }

      setMessage(data.message);

      setForm({
        student_id: "",
        full_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        course: "",
        year: "",
        password: "",
      });
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Student Registration</h1>

        <form onSubmit={handleSubmit}>
          <input
            name="student_id"
            placeholder="Student ID"
            value={form.student_id}
            onChange={handleChange}
            required
          />

          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            maxLength="10"
            required
          />

          <input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register Student
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;