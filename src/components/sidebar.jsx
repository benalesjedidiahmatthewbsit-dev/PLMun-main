import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  ReceiptText,
  ClipboardCheck,
  CalendarDays,
  ChartColumn,
  ScrollText,
  Settings,
  LogOut, // 1. Import LogOut icon if you want one
} from "lucide-react";

import "../styles/sidebar.css";

const menuGroups = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "ORGANIZATION MANAGEMENT",
    items: [
      {
        label: "Organizations",
        icon: Building2,
      },
      {
        label: "Membership Fees",
        icon: Users,
      },
    ],
  },
  {
    title: "FINANCIAL MANAGEMENT",
    items: [
      {
        label: "Budget Management",
        icon: Wallet,
      },
      {
        label: "Income & Expenses",
        icon: ArrowLeftRight,
      },
      {
        label: "Disbursements",
        icon: CreditCard,
      },
      {
        label: "Liquidation",
        icon: ReceiptText,
      },
    ],
  },
  {
    title: "WORKFLOW & MONITORING",
    items: [
      {
        label: "Requests & Approvals",
        icon: ClipboardCheck,
      },
      {
        label: "Calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "REPORTS & AUDIT",
    items: [
      {
        label: "Reports",
        icon: ChartColumn,
      },
      {
        label: "Audit Trail",
        icon: ScrollText,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  activePage,
  onPageChange,
  onLogout, // 2. Accept onLogout here!
}) {
  return (
    <aside className="sidebar">
      {/* Branding */}
      <div className="sidebar-header">
        <h2>PLMun</h2>
        <p className="sidebar-subtitle">
          FINANCIAL SYSTEM
        </p>
      </div>

      {/* Navigation Groups */}
      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        {menuGroups.map((group) => (
          <div
            key={group.title}
            className="sidebar-group"
          >
            <h3 className="sidebar-group-title">
              {group.title}
            </h3>

            <div className="sidebar-group-items">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activePage === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`sidebar-link ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() =>
                      onPageChange(item.label)
                    }
                    aria-current={
                      isActive ? "page" : undefined
                    }
                    title={item.label}
                  >
                    <Icon
                      size={18}
                      className="sidebar-icon"
                    />

                    <span className="sidebar-label">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Add the Logout Button at the bottom of the sidebar */}
      <div className="sidebar-footer" style={{ padding: "16px", marginTop: "auto" }}>
        <button
          type="button"
          className="sidebar-link logout-btn"
          onClick={onLogout} // <--- This triggers the logout state
          style={{ width: "100%", color: "#ef4444" }}
        >
          <LogOut size={18} className="sidebar-icon" />
          <span className="sidebar-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}