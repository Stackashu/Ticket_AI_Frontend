import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const TECHNOLOGIES = [
  // Frontend
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Next.js",
  "Gatsby",
  "Redux",
  // Backend
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Ruby on Rails",
  "ASP.NET",
  // Full Stack / Stacks
  "MERN",
  "MEAN",
  "LAMP",
  "JAMstack",
  "PERN",
  // Python Libraries
  "NumPy",
  "Pandas",
  "SciPy",
  "Matplotlib",
  "Seaborn",
  // Machine Learning
  "scikit-learn",
  "TensorFlow",
  "Keras",
  "PyTorch",
  "XGBoost",
  "LightGBM",
  "CatBoost",
  // Deep Learning
  "OpenCV",
  "Caffe",
  "Theano",
  "CNTK",
  "MXNet",
  // Data Science / Analytics
  "Jupyter",
  "Google Colab",
  "Tableau",
  "Power BI",
  "Plotly",
  // Databases
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Oracle",
  "Firebase",
  "Redis",
  // DevOps
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Travis CI",
  "AWS",
  "Azure",
  "GCP",
  "GitHub Actions",
  // Cybersecurity
  "Metasploit",
  "Wireshark",
  "Nmap",
  "Burp Suite",
  "Kali Linux",
  "John the Ripper",
  "Snort",
  "Nessus",
  // Web Technologies
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Bootstrap",
  "Tailwind CSS",
  "Sass",
  "Webpack",
  "Babel",
  // Mobile
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Android",
  "iOS",
  // Cloud/Serverless
  "AWS Lambda",
  "Firebase Functions",
  "Heroku",
  "Netlify",
  "Vercel",
  // Others
  "GraphQL",
  "REST API",
  "Socket.io",
  "RabbitMQ",
  "Elasticsearch",
  "Solr",
  "Kafka",
  "Git",
  "Linux",
  "Shell Scripting",
  "C",
  "C++",
  "Java",
  "Go",
  "Rust",
  "PHP",
  "Perl",
  "Scala",
  // Visualization/Reporting
  "D3.js",
  "ECharts",
  // Security/Authentication
  "OAuth",
  "JWT",
  "OpenID Connect",
];

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    skills: [],
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name == "role") {
      value = value.toLowerCase();
    }
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("res", data);
        navigate("/");
      } else {
        alert(data.message || "signup failed");
      }
    } catch (error) {
      console.error("Error occurred ", error.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
    setForm({
      email: '',
      password: '',
      skills: [],
      role: 'user'
    });
  };

  return (
    <div className="signup-outer">
      <div className="signup-inner">
        <div className="signup-content">
          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Enter your email id"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="signup-input"
            />

            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="signup-input"
            />

            <div className="signup-role-section">
              <h1 className="signup-role-title">Register as</h1>
              <label className="signup-role-label">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={handleChange}
                  className="signup-radio"
                />
                User
              </label>

              <label className="signup-role-label">
                <input
                  type="radio"
                  name="role"
                  value="moderator"
                  checked={form.role === "moderator"}
                  onChange={handleChange}
                  className="signup-radio"
                />
                Developer
              </label>
            </div>

            <div className="signup-skills-section">
              <div className="signup-select-wrapper">
                <select
                  name="skills"
                  value={form.skills || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (option) => option.value
                    );
                    setForm({ ...form, skills: selected });
                  }}
                  multiple
                  className="signup-skills-select"
                >
                  {TECHNOLOGIES.map((tech, idx) => (
                    <option
                      key={idx}
                      value={tech}
                      className="signup-skill-option"
                    >
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
              <div className="signup-skills-selected">
                {Array.isArray(form.skills) && form.skills.length > 0
                  ? form.skills.map((sk, idx) => (
                      <div>
                        <h1 key={idx} className="signup-skill-chip">
                          {sk}
                        </h1>
                        <span> X </span>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            <button
              type="submit"
              className="signup-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
