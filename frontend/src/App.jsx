import { useState } from "react";
import "./App.css";
import AdminLogin from "./AdminLogin.jsx";

function App() {
  // -----------------------------
  // Registration form
  // -----------------------------
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

  // -----------------------------
  // View Student
  // -----------------------------
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [viewError, setViewError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Register Student
  // -----------------------------
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

  // -----------------------------
  // View Student
  // -----------------------------
  const handleViewStudent = async (e) => {
    e.preventDefault();

    setStudent(null);
    setViewError("");

    if (!searchId.trim()) {
      setViewError("Please enter a Student ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${searchId.trim()}/`
      );

      const data = await response.json();

      if (!response.ok) {
        setViewError(data.detail || "Student not found.");
        return;
      }

      setStudent(data);
    } catch {
      setViewError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      {/* =========================
          Student Registration
      ========================== */}
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


      {/* =========================
          View Student
      ========================== */}
      <div className="card">
        <h1>View Student</h1>

        <form onSubmit={handleViewStudent}>
          <input
            type="text"
            placeholder="Enter Student ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "View Student"}
          </button>
        </form>

        {viewError && (
          <p className="error">
            {viewError}
          </p>
        )}

        {student && (
          <div className="student-details">

            <h2>Student Details</h2>

            <div className="detail-row">
              <strong>Student ID:</strong>
              <span>{student.student_id}</span>
            </div>

            <div className="detail-row">
              <strong>Full Name:</strong>
              <span>{student.full_name}</span>
            </div>

            <div className="detail-row">
              <strong>Email:</strong>
              <span>{student.email}</span>
            </div>

            <div className="detail-row">
              <strong>Phone:</strong>
              <span>{student.phone}</span>
            </div>

            <div className="detail-row">
              <strong>Date of Birth:</strong>
              <span>{student.date_of_birth}</span>
            </div>

            <div className="detail-row">
              <strong>Gender:</strong>
              <span>{student.gender}</span>
            </div>

            <div className="detail-row">
              <strong>Course:</strong>
              <span>{student.course}</span>
            </div>

            <div className="detail-row">
              <strong>Year:</strong>
              <span>{student.year}</span>
            </div>

            <div className="detail-row">
              <strong>Created At:</strong>
              <span>{student.created_at}</span>
            </div>

          </div>
        )}
      </div>

      <AdminLogin />

    </div>
  );
}

export default App;