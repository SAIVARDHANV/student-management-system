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
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [adminSession, setAdminSession] = useState(null);

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
      setEditForm({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        course: data.course,
        year: String(data.year),
      });
      setIsEditingStudent(false);
      setUpdateMessage("");
    } catch {
      setViewError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setUpdateError("");

    if (!/^\d{10}$/.test(editForm.phone)) {
      setUpdateError("Phone number must contain exactly 10 digits.");
      return;
    }

    setUpdatingStudent(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${student.student_id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminSession.token}`,
          },
          body: JSON.stringify({
            ...editForm,
            year: Number(editForm.year),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUpdateError(
          response.status === 401
            ? "Your admin session is invalid or expired. Please sign in again."
            : JSON.stringify(data)
        );
        return;
      }

      setStudent(data);
      setEditForm({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        course: data.course,
        year: String(data.year),
      });
      setIsEditingStudent(false);
      setUpdateMessage("Student updated successfully.");
    } catch {
      setUpdateError("Unable to connect to the server.");
    } finally {
      setUpdatingStudent(false);
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

            {isEditingStudent && adminSession ? (
              <form onSubmit={handleUpdateStudent}>
                <input
                  name="full_name"
                  placeholder="Full Name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  maxLength="10"
                  required
                />
                <input
                  name="date_of_birth"
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={handleEditChange}
                  required
                />
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
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
                  value={editForm.course}
                  onChange={handleEditChange}
                  required
                />
                <select
                  name="year"
                  value={editForm.year}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <button type="submit" disabled={updatingStudent}>
                  {updatingStudent ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingStudent(false);
                    setEditForm({
                      full_name: student.full_name,
                      email: student.email,
                      phone: student.phone,
                      date_of_birth: student.date_of_birth,
                      gender: student.gender,
                      course: student.course,
                      year: String(student.year),
                    });
                    setUpdateError("");
                  }}
                  disabled={updatingStudent}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
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
                {adminSession ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingStudent(true);
                      setUpdateMessage("");
                      setUpdateError("");
                    }}
                  >
                    Edit Student
                  </button>
                ) : (
                  <p className="admin-login-intro">
                    Sign in as an admin to update student information.
                  </p>
                )}
              </>
            )}

            {updateMessage && <p className="success">{updateMessage}</p>}
            {updateError && <p className="error">{updateError}</p>}

          </div>
        )}
      </div>

      <AdminLogin onSessionChange={setAdminSession} />

    </div>
  );
}

export default App;