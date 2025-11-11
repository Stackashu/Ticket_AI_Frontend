import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if(res.ok){
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Login failed")
      }
    } catch (error) {
      alert("Login - something went wrong")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="login-outer">
      <div className="login-inner">
        <div className="login-content">
          <form className="login-form" onSubmit={handleLogin} style={{
            background: "#fff",
            padding: "32px 28px 28px 28px",
            borderRadius: "9px",
            boxShadow: "0 2px 22px rgba(60, 81, 180, 0.06)",
            minWidth: 340,
            maxWidth: 370,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <h2 style={{
              marginBottom: "30px",
              fontWeight: 700,
              color: "#2643a5",
              fontSize: "2rem",
              letterSpacing: "1px",
              textAlign: "center"
            }}>
              Login
            </h2>
            <div style={{ width: "100%", marginBottom: "22px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#253466"
                }}>
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="login-input"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  border: "1px solid #c7cff3",
                  fontSize: 15,
                  marginBottom: 0,
                  outline: "none",
                }}
                autoComplete="email"
              />
            </div>
            <div style={{ width: "100%", marginBottom: "26px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#253466"
                }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="login-input"
                value={form.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  border: "1px solid #c7cff3",
                  fontSize: 15,
                  marginBottom: 0,
                  outline: "none",
                }}
                autoComplete="current-password"
              />
            </div>
            <button
              className="login-button"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#3250cd",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "1.08rem",
                padding: "11px 0",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.85 : 1,
                boxShadow: "0 1px 6px rgba(32,52,120,0.08)",
                transition: "all 0.17s"
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
