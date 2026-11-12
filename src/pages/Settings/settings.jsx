
import { useState } from "react";
import {
  Settings as SettingsIcon,
  UserRound,
  ShieldCheck,
  Bell,
  SlidersHorizontal,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
} from "lucide-react";

import "../../styles/settings.css";

// Default settings
const defaultSettings = {
  systemName: "PLMun Financial Management System",
  institution: "Pamantasan ng Lungsod ng Muntinlupa",
  currency: "PHP",
  fiscalYear: "2026",
  adminName: "Administrator",
  email: "admin@example.com",
  role: "System Administrator",
  emailNotifications: true,
  approvalNotifications: true,
  budgetAlerts: true,
  activityNotifications: false,
  theme: "light",
  language: "en",
  pageSize: "10",
};

const STORAGE_KEY = "plmun_financial_settings";

// Read saved settings
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return { ...defaultSettings };

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object") {
      return { ...defaultSettings };
    }

    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch {
    return { ...defaultSettings };
  }
}

const settingsTabs = [
  {
    id: "general",
    label: "General Settings",
    icon: SettingsIcon,
  },
  {
    id: "account",
    label: "Account Settings",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "preferences",
    label: "System Preferences",
    icon: SlidersHorizontal,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState(loadSettings);

  const [message, setMessage] = useState("");

  const [hasChanges, setHasChanges] = useState(false);

  // Update one setting
  const updateSetting = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setHasChanges(true);
    setMessage("");
  };

  // Save to browser storage
  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setHasChanges(false);
      setMessage("Settings saved successfully.");
    } catch {
      setMessage(
        "Unable to save settings. Check browser storage permissions."
      );
    }
  };

  // Reset current form to defaults
  const handleReset = () => {
    if (
      !window.confirm(
        "Reset all settings to their default values?"
      )
    ) {
      return;
    }

    setSettings({ ...defaultSettings });
    setHasChanges(true);
    setMessage("Default settings restored. Click Save Changes to keep them.");
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="settings-header">
        <div>
          <h1>System Settings</h1>
          <p>
            Manage your account, system configuration,
            and notification preferences.
          </p>
        </div>

        <div className="settings-header-actions">
          <button
            type="button"
            className="settings-btn settings-btn-secondary"
            onClick={handleReset}
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            className="settings-btn settings-btn-primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Save Feedback */}
      {message && (
        <div className="settings-message" role="status">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="settings-layout">
        {/* Settings Navigation */}
        <aside className="settings-sidebar">
          <h3>SETTINGS MENU</h3>

          <nav aria-label="Settings sections">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`settings-tab ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="settings-content">
          {/* GENERAL SETTINGS */}
          {activeTab === "general" && (
            <section className="settings-panel">
              <div className="settings-panel-header">
                <h2>General Settings</h2>
                <p>
                  Configure basic system information.
                </p>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label htmlFor="system-name">
                    System Name
                  </label>

                  <input
                    id="system-name"
                    type="text"
                    value={settings.systemName}
                    onChange={(e) =>
                      updateSetting(
                        "systemName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="institution">
                    Institution
                  </label>

                  <input
                    id="institution"
                    type="text"
                    value={settings.institution}
                    onChange={(e) =>
                      updateSetting(
                        "institution",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label htmlFor="currency">
                      Currency
                    </label>

                    <select
                      id="currency"
                      value={settings.currency}
                      onChange={(e) =>
                        updateSetting(
                          "currency",
                          e.target.value
                        )
                      }
                    >
                      <option value="PHP">
                        Philippine Peso (PHP)
                      </option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label htmlFor="fiscal-year">
                      Fiscal Year
                    </label>

                    <select
                      id="fiscal-year"
                      value={settings.fiscalYear}
                      onChange={(e) =>
                        updateSetting(
                          "fiscalYear",
                          e.target.value
                        )
                      }
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                <div className="settings-info">
                  <Info size={18} />
                  <p>
                    These settings are currently saved
                    to this browser only. Connect your
                    backend to apply them system-wide.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ACCOUNT SETTINGS */}
          {activeTab === "account" && (
            <section className="settings-panel">
              <div className="settings-panel-header">
                <h2>Account Settings</h2>
                <p>
                  Update administrator profile information.
                </p>
              </div>

              <div className="settings-profile">
                <div className="settings-avatar">
                  <UserRound size={28} />
                </div>

                <div>
                  <h3>{settings.adminName}</h3>
                  <p>{settings.role}</p>
                </div>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label htmlFor="admin-name">
                    Full Name
                  </label>

                  <input
                    id="admin-name"
                    type="text"
                    value={settings.adminName}
                    onChange={(e) =>
                      updateSetting(
                        "adminName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="admin-email">
                    Email Address
                  </label>

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={settings.email}
                    onChange={(e) =>
                      updateSetting(
                        "email",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="admin-role">
                    Account Role
                  </label>

                  <input
                    id="admin-role"
                    type="text"
                    value={settings.role}
                    disabled
                  />

                  <small>
                    Account roles must be managed by
                    the authentication system.
                  </small>
                </div>
              </div>
            </section>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === "security" && (
            <section className="settings-panel">
              <div className="settings-panel-header">
                <h2>Security Settings</h2>
                <p>
                  Manage your account security and access.
                </p>
              </div>

              <div className="settings-security-item">
                <div className="settings-security-icon">
                  <ShieldCheck size={21} />
                </div>

                <div className="settings-security-info">
                  <h3>Change Password</h3>
                  <p>
                    Update your account password to
                    keep your account secure.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-btn settings-btn-secondary"
                  disabled
                  title="Requires authentication API"
                >
                  Change Password
                </button>
              </div>

              <div className="settings-security-item">
                <div className="settings-security-icon">
                  <ShieldCheck size={21} />
                </div>

                <div className="settings-security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>
                    Add an additional layer of
                    verification during login.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-btn settings-btn-secondary"
                  disabled
                  title="Requires authentication API"
                >
                  Configure
                </button>
              </div>

              <div className="settings-info">
                <Info size={18} />
                <p>
                  Security functions will become
                  available after the authentication
                  backend is integrated.
                </p>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <section className="settings-panel">
              <div className="settings-panel-header">
                <h2>Notification Settings</h2>
                <p>
                  Choose which financial activities
                  you want to be notified about.
                </p>
              </div>

              <div className="settings-toggle-list">
                {[
                  {
                    key: "emailNotifications",
                    title: "Email Notifications",
                    description:
                      "Receive important system updates through email.",
                  },
                  {
                    key: "approvalNotifications",
                    title: "Approval Requests",
                    description:
                      "Receive alerts for pending financial approvals.",
                  },
                  {
                    key: "budgetAlerts",
                    title: "Budget Alerts",
                    description:
                      "Get notified about budget utilization and spending limits.",
                  },
                  {
                    key: "activityNotifications",
                    title: "Activity Notifications",
                    description:
                      "Receive updates about organization activities.",
                  },
                ].map((item) => (
                  <div
                    className="settings-toggle-item"
                    key={item.key}
                  >
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) =>
                          updateSetting(
                            item.key,
                            e.target.checked
                          )
                        }
                        aria-label={item.title}
                      />

                      <span className="settings-slider" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="settings-info">
                <Info size={18} />
                <p>
                  These controls save notification
                  preferences only. Actual delivery
                  requires a notification service.
                </p>
              </div>
            </section>
          )}

          {/* SYSTEM PREFERENCES */}
          {activeTab === "preferences" && (
            <section className="settings-panel">
              <div className="settings-panel-header">
                <h2>System Preferences</h2>
                <p>
                  Customize your application preferences.
                </p>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label htmlFor="system-theme">
                    Appearance
                  </label>

                  <select
                    id="system-theme"
                    value={settings.theme}
                    onChange={(e) =>
                      updateSetting(
                        "theme",
                        e.target.value
                      )
                    }
                  >
                    <option value="light">
                      Light Mode
                    </option>
                    <option value="dark">
                      Dark Mode
                    </option>
                  </select>

                  <small>
                    Theme selection is saved. Theme
                    styling requires additional CSS.
                  </small>
                </div>

                <div className="settings-field">
                  <label htmlFor="system-language">
                    Language
                  </label>

                  <select
                    id="system-language"
                    value={settings.language}
                    onChange={(e) =>
                      updateSetting(
                        "language",
                        e.target.value
                      )
                    }
                  >
                    <option value="en">English</option>
                    <option value="fil">Filipino</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label htmlFor="page-size">
                    Default Table Page Size
                  </label>

                  <select
                    id="page-size"
                    value={settings.pageSize}
                    onChange={(e) =>
                      updateSetting(
                        "pageSize",
                        e.target.value
                      )
                    }
                  >
                    <option value="10">10 rows</option>
                    <option value="25">25 rows</option>
                    <option value="50">50 rows</option>
                    <option value="100">100 rows</option>
                  </select>
                </div>

                <div className="settings-info">
                  <Info size={18} />
                  <p>
                    Preferences are stored locally.
                    Connect them to your application
                    layout, translations, and tables
                    to apply them throughout the system.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
