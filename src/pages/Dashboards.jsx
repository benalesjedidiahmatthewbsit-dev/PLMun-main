
import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import "../styles/dashboard.css";


const transactions = [
  {
    id: 1,
    description: "Membership Fee Collection",
    organization: "Student Council",
    type: "Income",
    amount: 15000,
    date: "2026-10-24",
    status: "Completed",
  },
  {
    id: 2,
    description: "Leadership Seminar Materials",
    organization: "Student Council",
    type: "Expense",
    amount: 5500,
    date: "2026-10-23",
    status: "Approved",
  },
  {
    id: 3,
    description: "Fundraising Activity",
    organization: "Student Council",
    type: "Income",
    amount: 8500,
    date: "2026-10-22",
    status: "Completed",
  },
  {
    id: 4,
    description: "Event Venue Preparation",
    organization: "Student Council",
    type: "Expense",
    amount: 3200,
    date: "2026-10-21",
    status: "Pending",
  },
];

const approvals = [
  {
    id: 1,
    title: "Budget Request - Leadership Seminar",
    organization: "Student Council",
    amount: 12500,
    status: "Pending",
  },
  {
    id: 2,
    title: "Disbursement - Event Materials",
    organization: "Student Council",
    amount: 4800,
    status: "Pending",
  },
  {
    id: 3,
    title: "Liquidation - Outreach Program",
    organization: "Student Council",
    amount: 7200,
    status: "Pending",
  },
];

const announcements = [
  {
    id: 1,
    title: "Welcome to the Financial Management System",
    message:
      "Manage and monitor student organization financial records in one centralized platform.",
    date: "2026-10-26",
  },
  {
    id: 2,
    title: "Financial Documentation Reminder",
    message:
      "Ensure all financial transactions have complete supporting documents before submission.",
    date: "2026-10-25",
  },
];


const formatMoney = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export default function Dashboard() {
  const [period, setPeriod] = useState("This Month");

 
  const financialData = {
    availableFunds: 125450.75,
    totalIncome: 210300,
    totalExpenses: 84849.25,
    pendingApprovals: 5,
  };

  const summaryCards = [
    {
      label: "Available Funds",
      value: formatMoney(financialData.availableFunds),
      icon: Wallet,
      color: "green",
      note: "Current available balance",
    },
    {
      label: "Total Income",
      value: formatMoney(financialData.totalIncome),
      icon: TrendingUp,
      color: "blue",
      note: "Total recorded income",
    },
    {
      label: "Total Expenses",
      value: formatMoney(financialData.totalExpenses),
      icon: TrendingDown,
      color: "orange",
      note: "Total recorded expenses",
    },
    {
      label: "Pending Approvals",
      value: financialData.pendingApprovals,
      icon: ClipboardCheck,
      color: "purple",
      note: "Requests awaiting review",
    },
  ];

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    []
  );

  const totalActivity =
    financialData.totalIncome + financialData.totalExpenses;

  const incomePercent =
    totalActivity > 0
      ? (financialData.totalIncome / totalActivity) * 100
      : 0;

  const expensePercent =
    totalActivity > 0
      ? (financialData.totalExpenses / totalActivity) * 100
      : 0;

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <section className="welcome">
        <div>
          <h2>Welcome back, Admin!</h2>
          <p>
            Here's an overview of your organization's
            financial activities.
          </p>
        </div>

        <div className="dashboard-period">
          <label htmlFor="dashboard-period">
            Reporting Period
          </label>

          <select
            id="dashboard-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </section>

      <section
        className="dashboard-summary"
        aria-label="Financial Summary"
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={`dashboard-stat-card ${card.color}`}
            >
              <div className="dashboard-stat-top">
                <p>{card.label}</p>

                <div className="dashboard-stat-icon">
                  <Icon size={20} />
                </div>
              </div>

              <h3>{card.value}</h3>
              <small>{card.note}</small>
            </div>
          );
        })}
      </section>


      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3>Financial Overview</h3>
              <p>Income and expense distribution</p>
            </div>
          </div>

          <div className="financial-overview">
            <div className="overview-item">
              <div className="overview-label">
                <span>Total Income</span>
                <strong>
                  {formatMoney(financialData.totalIncome)}
                </strong>
              </div>

              <div
                className="overview-progress"
                role="progressbar"
                aria-label="Income proportion"
                aria-valuenow={incomePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="overview-progress-fill income"
                  style={{ width: `${incomePercent}%` }}
                />
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-label">
                <span>Total Expenses</span>
                <strong>
                  {formatMoney(financialData.totalExpenses)}
                </strong>
              </div>

              <div
                className="overview-progress"
                role="progressbar"
                aria-label="Expense proportion"
                aria-valuenow={expensePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="overview-progress-fill expense"
                  style={{ width: `${expensePercent}%` }}
                />
              </div>
            </div>

            <div className="overview-balance">
              <div>
                <p>Net Balance</p>
                <h3>
                  {formatMoney(
                    financialData.totalIncome -
                      financialData.totalExpenses
                  )}
                </h3>
              </div>

              <CheckCircle2 size={24} />
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3>Pending Approvals</h3>
              <p>Requests requiring attention</p>
            </div>

            <span className="dashboard-count">
              {financialData.pendingApprovals}
            </span>
          </div>

          <div className="dashboard-approval-list">
            {approvals.map((item) => (
              <div
                className="dashboard-approval-item"
                key={item.id}
              >
                <div className="approval-icon">
                  <Clock3 size={18} />
                </div>

                <div className="approval-details">
                  <h4>{item.title}</h4>
                  <p>{item.organization}</p>
                  <strong>
                    {formatMoney(item.amount)}
                  </strong>
                </div>

                <span className="dashboard-status pending">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <p className="dashboard-panel-note">
            Showing {approvals.length} of{" "}
            {financialData.pendingApprovals} pending requests.
          </p>
        </section>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Latest recorded financial activities</p>
          </div>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Organization</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.organization}</td>
                  <td>{formatDate(item.date)}</td>

                  <td>
                    <span
                      className={`transaction-type ${item.type.toLowerCase()}`}
                    >
                      {item.type === "Income" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {item.type}
                    </span>
                  </td>

                  <td className="dashboard-amount">
                    {formatMoney(item.amount)}
                  </td>

                  <td>
                    <span
                      className={`dashboard-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h3>Announcements</h3>
            <p>Important system notices and reminders</p>
          </div>

          <Bell size={19} />
        </div>

        <div className="dashboard-announcements">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="dashboard-announcement"
            >
              <div className="announcement-icon">
                <AlertCircle size={19} />
              </div>

              <div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
                <small>{formatDate(item.date)}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
