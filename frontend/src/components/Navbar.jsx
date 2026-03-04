import "../componentSytles/Navbar.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UserMenu from "./UserMenu";
import { useEffect, useState, useRef } from "react";
import AvatarLoader from "./AvatarLoader";

/* ICONS */
import { HiMenu } from "react-icons/hi";
import { FiSearch, FiUpload, FiMoreVertical } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";
import "../modal/ChangePasswordModal";
import { ChangePassword } from "../modal/ChangePasswordModal";

export const Navbar = ({ setSidebar }) => {
  const { user, setUser, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const menuRef = useRef(null);
  // const [mobileSearch, setMobileSearch] = useState(false);

  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSearch(text);
        navigate(`/search?q=${text}`);
        setListening(false);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    recognitionRef.current.start();
    setListening(true);
  };
  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });
  useEffect(() => {
    if (!user) setShowMenu(false);
  }, [user]);

  const username = user?.data?.username;
  const avatar = user?.data?.avatar;

  return (
    <nav className="navbar">
     
      <div className="nav-left">
        <button className="icon-btn" onClick={() => setSidebar((p) => !p)}>
          <HiMenu size={24} />
        </button>

          
        <img
          src={logo}
          alt="logo"
          className="logo"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="nav-center">
        <form className="search-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" className="search-btn">
            <FiSearch size={30} />
          </button>
        </form>

        <button
          type="button"
          className={`icon-btn mic-btn ${listening ? "active" : ""}`}
          onClick={handleVoiceSearch}
        >
          <MdKeyboardVoice size={22} />
        </button>
      </div>

      <div className="nav-right">
        <Link to="/upload" className="icon-btn">
          <FiUpload size={22} />
        </Link>

        <button className="icon-btn">
          <IoNotificationsOutline size={24} />
        </button>

        <button className="icon-btn">
          <FiMoreVertical size={22} />
        </button>

        <div ref={menuRef} className="profile-wrapper">
          {loading ? (
            <AvatarLoader />
          ) : (
            <div
              className={`user-avatar ${!user ? "signin" : ""}`}
              onClick={() => {
                if (!user?.data) {
                  navigate("/login");
                } else {
                  setShowMenu((prev) => !prev);
                }
              }}
            >
              {user?.data ? (
                avatar ? (
                  <img src={avatar} alt="user avatar" />
                ) : (
                  <span>{username?.charAt(0).toUpperCase()}</span>
                )
              ) : (
                "Sign in"
              )}
            </div>
          )}

          {user && showMenu && (
            <UserMenu
              user={user}
              setUser={setUser}
              closeMenu={() => setShowMenu(false)}
              openChangePassModal={() => setOpenChangePass(true)}
            />
          )}

          <ChangePassword
            open={openChangePass}
            onClose={() => setOpenChangePass(false)}
          />
        </div>
      </div>
    </nav>
  );
};
