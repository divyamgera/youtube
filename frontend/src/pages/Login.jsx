import React, { useState } from "react";

import "../pagesStyles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth.js";
import { useAuth } from "../utils/AuthContext.jsx";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar.jsx";

export const Login = ({ sidebar }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  // const {setUser} = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      data.append("email", formData.email);
      data.append("password", formData.password);

      await loginUser(data);

      await login(); // for render avatar just after login

      toast.success("Login Successful");

      navigate("/");
    } catch (error) {
      // console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              required
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit">Login</button>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
};
