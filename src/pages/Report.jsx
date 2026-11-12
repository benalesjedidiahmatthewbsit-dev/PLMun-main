
import { useMemo, useState } from "react";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  Download,
  Eye,
  FileBarChart,
} from "lucide-react";

import "../styles/reports.css";

const reports = [
  {
    id: 1,
    name: "Income Report",
    description: "Summary of all income received",
    category: "Income",
    status: "Available",
    icon: TrendingUp,
  },
  {
    id: 2,
    name: "Expense Report",
    description: "Summary of all organization expenses",
    category: "Expenses",
    status: "Available",
    icon: TrendingDown,
  },
  {
    id: 3,
    name: "Budget Report",
    description: "Budget allocation and utilization summary",
    category: "Budget",
    status: "Available",
    icon: Wallet,
  },
  {
    id: 4,
    name: "Membership Fees Report",
    description: "Membership collections and payment records",
    category: "Membership",
    status: "Available",
    icon: FileText,
  },
  {
    id: 5,
    name: "Disbursement Report",
    description: "Summary of released financial transactions",
    category: "Disbursements",
    status: "Available",
    icon: FileBarChart,
  },
];

export default function Reports() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        report.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        report.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleView = (report) => {
    window.alert(
      `${report.name} preview is not implemented yet.`
    );
  };

  const handleDownload = (report) => {
    window.alert(
      `${report.name} export is not implemented yet.`
    );
  };

  return (
    <section className="reports-page">
      {/* Page Header */}
      <div className="reports-header">
        <div>
          <h1>Financial Reports</h1>
          <p>
            View and manage student organization
            financial reports.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="reports-summary">
        <div className="reports-summary-card">
          <p>Total Report Types</p>
          <h2>{reports.length}</h2>
          <small>Available financial categories</small>
        </div>

        <div className="reports-summary-card">
          <p>Income Reports</p>
          <h2>
            {reports.filter(
              (report) => report.category === "Income"
            ).length}
          </h2>
          <small>Income reporting</small>
        </div>

        <div className="reports-summary-card">
          <p>Expense Reports</p>
          <h2>
            {reports.filter(
              (report) => report.category === "Expenses"
            ).length}
          </h2>
          <small>Expense reporting</small>
        </div>

        <div className="reports-summary-card">
          <p>Budget Reports</p>
          <h2>
            {reports.filter(
              (report) => report.category === "Budget"
            ).length}
          </h2>
          <small>Budget monitoring</small>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <div className="reports-filter-group">
          <label htmlFor="report-search">
            Search Reports
          </label>

          <div className="reports-search-field">
            <Search size={18} />

            <input
              id="report-search"
              type="search"
              placeholder="Search report..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="reports-filter-group">
          <label htmlFor="report-category">
            Report Category
          </label>

          <select
            id="report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Income">Income</option>
            <option value="Expenses">Expenses</option>
            <option value="Budget">Budget</option>
            <option value="Membership">Membership</option>
            <option value="Disbursements">
              Disbursements
            </option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-panel">
        <div className="reports-panel-header">
          <div>
            <h2>Available Reports</h2>
            <p>
              {filteredReports.length} report type(s) found
            </p>
          </div>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Description</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const Icon = report.icon;

                  return (
                    <tr key={report.id}>
                      <td>
                        <div className="reports-name">
                          <Icon size={18} />
                          <span>{report.name}</span>
                        </div>
                      </td>

                      <td>{report.description}</td>

                      <td>{report.category}</td>

                      <td>
                        <div className="reports-row-actions">
                          <button
                            type="button"
                            className="reports-btn reports-btn-secondary"
                            onClick={() => handleView(report)}
                            aria-label={`View ${report.name}`}
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            type="button"
                            className="reports-btn reports-btn-primary"
                            onClick={() => handleDownload(report)}
                            aria-label={`Download ${report.name}`}
                          >
                            <Download size={15} />
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="reports-empty">
                    No matching reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
