import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    emial: "",
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
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
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
        localStorage.setItem("token",data.token)
        localStorage.setItem("user".JSON.stringify(data.user))
        navigate("/")
      }else{
        alert(data.message || "signu[ failed")
      }
    } catch (error) {
        alert("Signup - something went wrong")
    }finally{
        setLoading(false)
    }
  };
  return (
    <div>
      <div>
        <div>
          <form>
            <input type='text' name="email" placeholder='Enter your email' />
            <input type='text' name="passoword" placeholder='Enter your password' />
            <button>Login in</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
