import "../componentSytles/UserMenu.css";
import { logoutUser } from "../utils/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../utils/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
// import { ChangePassword } from "../modal/ChangePasswordModal";
const UserMenu = ({ user, setUser, closeMenu, openChangePassModal }) => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);

  // const [openChangePass, setOpenChangePass] = useState(false);
  // console.log("user", user);
  const username = user?.data?.username;

  const navigateToChannel = () => {
    navigate(`/users/c/${username}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      toast.info("Logged Out Successfully");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="user-menu-wrapper">
        {
          <div className="user-dropdown">
            {/* USER INFO */}
            <div className="user-info">
              <img src={user?.data?.avatar} alt="$$" />
              <div>
                <h4>{user?.fullname}</h4>
                <p>@{user?.data?.username}</p>
              </div>
            </div>

            <button
              className="view-channel"
              onClick={() => navigateToChannel(user.data.username)}
            >
              View your channel
            </button>

            <div className="divider" />

            {/* MENU */}
            <ul>
              <li className="menu-item" onClick={toggleTheme}>
                {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
                <span>Appearance: {theme === "light" ? "Dark" : "Light"}</span>
              </li>
              <li className="menu-item">🎨 Customization</li>
              <Link to="/updateprofile">
                <li className="menu-item">👤 Update Profile </li>
              </Link>
              <li className="menu-item">⚙️ Settings</li>
              <li
                className="menu-item"
                onClick={() => {
                  closeMenu();
                  openChangePassModal();
                }}
              >
                🔐 Change Password
              </li>
            </ul>

            <div className="divider" />

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        }
      </div>

      {/* <ChangePassword
        open={openChangePass}
        onClose={() => setOpenChangePass(false)}
      /> */}
    </>
  );
};

export default UserMenu;
