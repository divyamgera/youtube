// import "../componentSytles/Navbar.css";
// import menu_icon from "../assets/menu.png";
// import logo from "../assets/logo.png";
// import { Link } from "react-router-dom";
// import search_icon from "../assets/search.png";
// import upload_icon from "../assets/upload.png";
// import more_icon from "../assets/more.png";
// import notification_icon from "../assets/notification.png";
// import { useAuth } from "../utils/AuthContext";
// import UserMenu from "./UserMenu";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AvatarLoader from "./AvatarLoader";

// export const Navbar = ({ setSidebar }) => {
//   const { user, loading } = useAuth();
//   const [search, setSearch] = useState("");

//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!search.trim()) return;
//     navigate(`/search?q=${search}`);
//   };

//   useEffect(() => {
//     if (!user) setShowMenu(false);
//   }, [user]);

//   // console.log("Avatar user", user?.data?.avatar)
//   const username = user?.data?.username || "U";
//   const avatar = user?.data?.avatar || null;
//   return (
//     <nav className="flex-div">
//       <div className="nav-left flex-div">
//         <img
//           className="menu-icon"
//           onClick={() => setSidebar((prev) => !prev)}
//           src={menu_icon}
//           alt="menu_icon"
//         />
//         <img className="logo" src={logo} alt="logo" />
//       </div>

//       <div className="nav-middle flex-div">
//         <div className="search-box flex-div">
//           <form onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           </form>

//           <img src={search_icon} alt="search" />

//         </div>
//       </div>

//       <div className="nav-right flex-div">
//         <Link to="/upload">
//           {" "}
//           <img src={upload_icon} alt="upload" />{" "}
//         </Link>
//         <img src={more_icon} alt="more" />
//         <img src={notification_icon} alt="notify" />
//         {/* AVATAR AREA */}
//         {loading ? (
//           <AvatarLoader />
//         ) : (
//           <div
//             className={`user-avatar ${!user ? "signin" : ""}`}
//             onClick={() => {
//               if (!user) navigate("/login");
//               else setShowMenu((prev) => !prev);
//             }}
//           >
//             {user ? (
//               avatar ? (
//                 <img src={avatar} alt="user" />
//               ) : (
//                 <span>{username.charAt(0).toUpperCase()}</span>
//               )
//             ) : (
//               "Sign in"
//             )}
//           </div>
//         )}

//         {user && showMenu && <UserMenu user={user} />}
//       </div>
//     </nav>
//   );
// };

import "../componentSytles/Navbar.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";
import AvatarLoader from "./AvatarLoader";

/* ICONS */
import { HiMenu } from "react-icons/hi";
import { FiSearch, FiUpload, FiMoreVertical } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";

export const Navbar = ({ setSidebar }) => {
  const { user, setUser, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

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

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // ya "hi-IN"
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setSearch(text); // input me fill
      setListening(false);

      navigate(`/search?q=${text}`); // 🔥 SAME FLOW
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  useEffect(() => {
    if (!user ) setShowMenu(false);
  }, [user]);

  const username = user?.data?.username;
  const avatar = user?.data?.avatar || null;

  return (
    <nav className="navbar">
      {/* LEFT */}
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

      {/* CENTER */}
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

        {/* MIC */}
        <button
          type="button"
          className={`icon-btn mic-btn ${listening ? "active" : ""}`}
          onClick={handleVoiceSearch}
        >
          <MdKeyboardVoice size={22} />
        </button>
      </div>

      {/* RIGHT */}
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

        {loading ? (
          <AvatarLoader />
        ) : (
          <div
            className={`user-avatar ${!user ? "signin" : ""}`}
            onClick={() => {
              if (!user || user.data==null) navigate("/login");
              else setShowMenu((p) => !p);
            }}
          >
            {user ? (
              avatar ? (
                <img src={avatar} alt="user" />
              ) : (
                <Link to="/login"> Sign-In</Link> 
              )
            ) : (
              "Sign in"
            )}
          </div>
        )}

        {user && showMenu && <UserMenu user={user} setUser={setUser} />}
      </div>
    </nav>
  );
};
