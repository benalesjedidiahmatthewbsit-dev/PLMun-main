
import { useMemo, useState } from "react";
import {
  ScrollText,
  Wallet,
  ShieldCheck,
  Users,
  Search,
  Download,
  Eye,
  X,
  Clock3,
} from "lucide-react";

import "../../styles/Reports/audittrail.css";

// Demo data only. Real logs must come from the backend.
const auditLogs = [
  {
    id: "LOG-0008",
    timestamp: "2026-10-26T14:35:00",
    user: "System Admin",
    role: "Administrator",
    action: "Approved",
    module: "Budget Management",
    description: "Approved a student activity budget.",
    record: "BUD-1008",
    details: {
      organization: "Student Council",
      amount: "PHP 15,000.00",
      previousStatus: "Pending",
      newStatus: "Approved",
    },
  },
  {
    id: "LOG-0007",
    timestamp: "2026-10-26T11:20:00",
    user: "Organization Treasurer",
    role: "Treasurer",
    action: "Created",
    module: "Membership Fees",
    description: "Recorded a membership fee payment.",
    record: "PAY-1045",
    details: {
      amount: "PHP 250.00",
      paymentStatus: "Paid",
    },
  },
  {
    id: "LOG-0006",
    timestamp: "2026-10-26T09:15:00",
    user: "Unknown User",
    role: "Unauthenticated",
    action: "Security",
    module: "Authentication",
    description: "Unsuccessful login attempt.",
    record: "AUTH-1006",
    details: {
      result: "Failed",
      reason: "Invalid credentials",
    },
  },
  {
    id: "LOG-0005",
    timestamp: "2026-10-25T16:45:00",
    user: "System Admin",
    role: "Administrator",
    action: "Updated",
    module: "Budget Management",
    description: "Updated the community outreach allocation.",
    record: "BUD-1004",
    details: {
      previousAmount: "PHP 30,000.00",
      newAmount: "PHP 35,000.00",
    },
  },
  {
    id: "LOG-0004",
    timestamp: "2026-10-25T13:30:00",
    user: "Financial Officer",
    role: "Financial Officer",
    action: "Created",
    module: "Disbursements",
    description: "Created a disbursement request.",
    record: "DIS-1012",
    details: {
      amount: "PHP 8,500.00",
      status: "Pending",
    },
  },
  {
    id: "LOG-0003",
    timestamp: "2026-10-24T15:10:00",
    user: "Organization Treasurer",
    role: "Treasurer",
    action: "Submitted",
    module: "Liquidation",
    description: "Submitted liquidation documents.",
    record: "LIQ-1003",
    details: {
      amount: "PHP 7,200.00",
      status: "Under Review",
    },
  },
  {
    id: "LOG-0002",
    timestamp: "2026-10-24T10:00:00",
    user: "System Admin",
    role: "Administrator",
    action: "Security",
    module: "Authentication",
    description: "Administrator signed into the system.",
    record: "AUTH-1002",
    details: {
      result: "Successful",
    },
  },
  {
    id: "LOG-0001",
    timestamp: "2026-10-23T08:30:00",
    user: "Organization Officer",
    role: "Organization Officer",
    action: "Created",
    module: "Organizations",
    description: "Registered a new organization profile.",
    record: "ORG-1001",
    details: {
      organization: "Engineering Student Society",
      status: "Pending Verification",
    },
  },
];

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getDate = (timestamp) => timestamp.slice(0, 10);

export default function AuditTrail() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const actions = [...new Set(auditLogs.map((log) => log.action))];
  const modules = [...new Set(auditLogs.map((log) => log.module))];

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs
      .filter((log) => {
        const searchable = [
          log.id,
          log.user,
          log.role,
          log.action,
          log.module,
          log.description,
          log.record,
        ].join(" ").toLowerCase();

        return (
          searchable.includes(query) &&
          (actionFilter === "All" ||
            log.action === actionFilter) &&
          (moduleFilter === "All" ||
            log.module === moduleFilter) &&
          (!dateFilter || getDate(log.timestamp) === dateFilter)
        );
      })
      .sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp)
      );
  }, [search, actionFilter, moduleFilter, dateFilter]);

  const summary = {
    total: auditLogs.length,
    financial: auditLogs.filter((log) =>
      [
        "Budget Management",
        "Disbursements",
        "Liquidation",
      ].includes(log.module)
    ).length,
    security: auditLogs.filter(
      (log) => log.action === "Security"
    ).length,
    users: new Set(
      auditLogs
        .filter((log) => log.role !== "Unauthenticated")
        .map((log) => log.user)
    ).size,
  };

  const cards = [
    {
      label: "Total Activities",
      value: summary.total,
      icon: ScrollText,
    },
    {
      label: "Financial Changes",
      value: summary.financial,
      icon: Wallet,
    },
    {
      label: "Security Events",
      value: summary.security,
      icon: ShieldCheck,
    },
    {
      label: "Unique Users",
      value: summary.users,
      icon: Users,
    },
  ];

  const escapeCsv = (value) => {
    const text = String(value ?? "");
    const safe = /^[\s]*[=+\-@\t\r]/.test(text)
      ? `'${text}`
      : text;

    return `"${safe.replace(/"/g, '""')}"`;
  };

  const exportCSV = () => {
    const headers = [
      "Log ID",
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Module",
      "Description",
      "Record ID",
      "Details",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.user,
      log.role,
      log.action,
      log.module,
      log.description,
      log.record,
      JSON.stringify(log.details),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv].join("") && ["\uFEFF", csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "plmun-audit-trail.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setActionFilter("All");
    setModuleFilter("All");
    setDateFilter("");
  };

  return (
    <div className="audit-page">
      {/* Header */}
      <div className="audit-header">
        <div>
          <h1>Audit Trail</h1>
          <p>
            Review system activity, financial changes,
            and user actions.
          </p>
        </div>

        <button
          type="button"
          className="audit-btn audit-btn-primary"
          onClick={exportCSV}
          disabled={filteredLogs.length === 0}
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <section
        className="audit-summary"
        aria-label="Audit Summary"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="audit-summary-card" key={card.label}>
              <div className="audit-summary-top">
                <span>{card.label}</span>
                <Icon size={20} />
              </div>

              <h2>{card.value}</h2>
            </div>
          );
        })}
      </section>

      {/* Filters */}
      <section className="audit-filters">
        <div className="audit-field audit-search">
          <label htmlFor="audit-search">
            Search Activity
          </label>

          <div className="audit-search-input">
            <Search size={17} />

            <input
              id="audit-search"
              type="search"
              placeholder="Search user, record, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="audit-field">
          <label htmlFor="audit-action">
            Action
          </label>

          <select
            id="audit-action"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="All">All Actions</option>

            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="audit-field">
          <label htmlFor="audit-module">
            Module
          </label>

          <select
            id="audit-module"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="All">All Modules</option>

            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        <div className="audit-field">
          <label htmlFor="audit-date">
            Date
          </label>

          <input
            id="audit-date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="audit-btn audit-btn-secondary"
          onClick={resetFilters}
        >
          Clear Filters
        </button>
      </section>

      {/* Audit Table */}
      <section className="audit-panel">
        <div className="audit-panel-header">
          <div>
            <h2>Activity Logs</h2>
            <p>
              Showing {filteredLogs.length} of{" "}
              {auditLogs.length} recorded activities
            </p>
          </div>

          <Clock3 size={20} />
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>Record ID</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="audit-empty">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="audit-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>

                    <td>
                      <div className="audit-user">
                        <strong>{log.user}</strong>
                        <span>{log.role}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`audit-action ${log.action.toLowerCase()}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>{log.module}</td>

                    <td>{log.description}</td>

                    <td className="audit-record-id">
                      {log.record}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="audit-view-btn"
                        onClick={() => setSelectedLog(log)}
                        aria-label={`View details for ${log.id}`}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Details Modal */}
      {selectedLog && (
        <div
          className="audit-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedLog(null);
            }
          }}
        >
          <section
            className="audit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-detail-title"
          >
            <div className="audit-modal-header">
              <div>
                <h2 id="audit-detail-title">
                  Activity Details
                </h2>
                <p>{selectedLog.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <dl className="audit-detail-grid">
              {[
                ["Date & Time", formatDateTime(selectedLog.timestamp)],
                ["User", selectedLog.user],
                ["Role", selectedLog.role],
                ["Action", selectedLog.action],
                ["Module", selectedLog.module],
                ["Record ID", selectedLog.record],
                ["Description", selectedLog.description],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="audit-detail-heading">
              Additional Information
            </h3>

            <dl className="audit-detail-grid">
              {Object.entries(selectedLog.details).map(
                ([key, value]) => (
                  <div key={key}>
                    <dt>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </dt>
                    <dd>{String(value)}</dd>
                  </div>
                )
              )}
            </dl>

            <div className="audit-modal-footer">
              <button
                type="button"
                className="audit-btn audit-btn-secondary"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
