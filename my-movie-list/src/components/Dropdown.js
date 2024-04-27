import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Dropdown({ toggle }) {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  return (
    <div className="dropdown-menu">
      <div
        id="profile-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          navigate("/profile");
        }}
      >
        Profile
      </div>
      <div
        id="list-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          navigate("/your-list");
        }}
      >
        List
      </div>
      <div
        id="settings-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          navigate("/settings");
        }}
      >
        Settings
      </div>
      <div
        id="logout-link"
        className="dropdown-link"
        onClick={() => {
          toggle();
          handleLogout();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  );
}

export default Dropdown;
