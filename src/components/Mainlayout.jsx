import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

export default function MainLayout({
  children,
  activePage,
  onPageChange,
  onLogout, // 1. Accept onLogout from App.jsx
}) {
  return (
    <div className="dashboard">
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        onLogout={onLogout} // 2. Pass it down to Sidebar (or Navbar if you prefer)
      />

      <main className="main">
        <Navbar onLogout={onLogout} />

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
