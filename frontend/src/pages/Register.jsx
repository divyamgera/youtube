import { useState } from "react";
import "../pagesStyles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth.js";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar.jsx";

const Register = ({ sidebar }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (avatar) data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      const res = await registerUser(data);
      console.log(res);
      toast.success("Registered Successfully");
      // alert("Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Registeration Failed");
    }
  };

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className="register-container">
        <div className="register-card">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="input-group">
              <label>Fullname</label>
              <input
                type="text"
                placeholder="Enter fullname"
                name="fullname"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Avatar</label>
              <input
                type="file"
                name="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>

            <div className="input-group">
              <label>CoverImage</label>
              <input
                type="file"
                name="coverImage"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </div>

            <button type="submit">Register</button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login">
              <span>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
