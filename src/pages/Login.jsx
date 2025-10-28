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
        alert(data.message || "signup failed")
      }
    } catch (error) {
      alert("Signup - something went wrong")
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="login-outer">
      <div className="login-inner">
        <div className="login-content">
          <form className="login-form" onSubmit={handleLogin}>
            <input 
              type='text'
              name="email" 
              placeholder='Enter your email'
              className="login-input"
              value={form.email}
              onChange={handleChange}
            />
            <input 
              type='password'
              name="password" 
              placeholder='Enter your password'
              className="login-input"
              value={form.password}
              onChange={handleChange}
            />
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
