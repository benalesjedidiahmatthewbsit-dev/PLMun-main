import { useState } from "react";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import "../styles/navbar.css";

export default function Navbar({ onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogoutClick = () => {
    localStorage.removeItem("isLoggedIn"); // Clear saved login state
    setIsProfileOpen(false); // Close dropdown
    if (onLogout) {
      onLogout(); // Switch back to Login page in App.jsx
    } else {
      window.location.reload(); // Fallback if Mainlayout hasn't passed onLogout yet
    }
  };

  return (
    <header className="header">
      {/* System Information */}
      <div className="header-info">
        <h2 className="header-title">
          CENTRALIZED FINANCIAL MANAGEMENT SYSTEM
        </h2>

        <p className="header-subtitle">
          FOR STUDENT ORGANIZATIONS
        </p>

        <small className="header-university">
          Pamantasan ng Lungsod ng Muntinlupa
        </small>
      </div>

      {/* Right Section */}
      <div className="header-actions">
        {/* Notification */}
        <button
          type="button"
          className="header-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Admin Profile */}
        <div className="admin-profile">
          <button
            type="button"
            className="admin-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
          >
            <div className="admin-avatar">
              <CircleUserRound size={22} />
            </div>

            <div className="admin-info">
              <span className="admin-name">Admin</span>
              <small className="admin-role">
                Administrator
              </small>
            </div>

            <ChevronDown
              size={16}
              className={`admin-chevron ${
                isProfileOpen ? "rotate" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="admin-dropdown" role="menu">
              <button
                type="button"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
              >
                <UserRound size={17} />
                My Profile
              </button>

              <button
                type="button"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={17} />
                Settings
              </button>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item logout"
                role="menuitem"
                onClick={handleLogoutClick}
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}