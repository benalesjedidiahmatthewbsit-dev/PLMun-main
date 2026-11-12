import { useState } from "react";

import MainLayout from "./components/Mainlayout";

import Dashboard from "./pages/Dashboards";
import MembershipFees from "./pages/MembershipFees";
import BudgetManagement from "./pages/BudgetManagement";
import Liquidation from "./pages/Liquidation";
import Reports from "./pages/Report";
import Settings from "./pages/Settings/settings";
import Calendar from "./pages/Monitoring/calendar";
import auditTrail from "./pages/Reports/audittrail";
import Login from "./pages/login";

import "./styles/dashboard.css";
import { Import } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [page, setPage] = useState("Dashboard");

 const pages = {
  "Dashboard": Dashboard,
  "Membership Fees": MembershipFees,
  "Budget Management": BudgetManagement,
  "Liquidation": Liquidation, 
  "Settings": Settings,
  "Calendar": Calendar,
  "Audit Trail": auditTrail,
};

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const ActivePage = pages[page];

  return (
    <MainLayout
      activePage={page}
      onPageChange={setPage}
      onLogout={handleLogout}
    >
      {ActivePage ? (
        <ActivePage />
      ) : (
        <div className="page-placeholder">
          <h1>{page}</h1>
          <p>
            The {page} module is currently under
            development.
          </p>
        </div>
      )}
    </MainLayout>
  );
}