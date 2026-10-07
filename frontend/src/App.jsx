import { useState } from "react";
import Login from "./login";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      {page === "login" ? (
        <Login />
      ) : (
        <div className="container">
          <div className="card">
            <h1>Student Registration</h1>

            {/* 
              Put your existing registration form code here.
              Keep the registration form you already created.
            */}

          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        {page === "login" ? (
          <button onClick={() => setPage("register")}>
            Create Student Account
          </button>
        ) : (
          <button onClick={() => setPage("login")}>
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );
}

export default App;