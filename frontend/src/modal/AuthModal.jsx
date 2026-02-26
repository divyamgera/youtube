import "../modalSytles/AuthModal.css";

const AuthModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h3>Sign in to continue</h3>
        <p>Please login to perform this action.</p>

        <div className="auth-buttons">
          <button
            className="auth-login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In
          </button>

          <button className="auth-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
