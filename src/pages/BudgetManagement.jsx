
import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingDown,
  CircleDollarSign,
  ChartNoAxesCombined,
  Plus,
  Search,
  X,
  PiggyBank,
} from "lucide-react";

import "../styles/budgetManagement.css";

// Temporary budget records
const initialBudgets = [
  {
    id: 1,
    organization: "Student Council",
    category: "Student Activities",
    allocated: 100000,
    spent: 80000,
  },
  {
    id: 2,
    organization: "Student Council",
    category: "Seminars and Training",
    allocated: 75000,
    spent: 47850,
  },
  {
    id: 3,
    organization: "Student Council",
    category: "Community Outreach",
    allocated: 70000,
    spent: 40000,
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

const getUtilization = (budget) => {
  if (budget.allocated <= 0) return 0;

  return (budget.spent / budget.allocated) * 100;
};

const getBudgetStatus = (budget) => {
  const utilization = getUtilization(budget);

  if (utilization >= 100) return "Fully Utilized";
  if (utilization >= 80) return "Near Limit";

  return "Within Budget";
};

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    organization: "",
    category: "",
    allocated: "",
  });

 
  const summary = useMemo(() => {
    const totalBudget = budgets.reduce(
      (sum, item) => sum + item.allocated,
      0
    );

    const budgetUsed = budgets.reduce(
      (sum, item) => sum + item.spent,
      0
    );

    return {
      totalBudget,
      budgetUsed,
      remainingBudget: totalBudget - budgetUsed,
      utilization:
        totalBudget > 0
          ? (budgetUsed / totalBudget) * 100
          : 0,
    };
  }, [budgets]);

  // Search and status filtering
  const filteredBudgets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return budgets.filter((budget) => {
      const matchesSearch =
        budget.organization.toLowerCase().includes(query) ||
        budget.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        getBudgetStatus(budget) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [budgets, search, statusFilter]);

  const summaryCards = [
    {
      label: "Total Budget",
      value: formatMoney(summary.totalBudget),
      note: "Total allocated funds",
      icon: Wallet,
      color: "green",
    },
    {
      label: "Budget Used",
      value: formatMoney(summary.budgetUsed),
      note: "Recorded utilization",
      icon: TrendingDown,
      color: "orange",
    },
    {
      label: "Remaining Budget",
      value: formatMoney(summary.remainingBudget),
      note: "Unspent allocated funds",
      icon: PiggyBank,
      color: "blue",
    },
    {
      label: "Budget Utilization",
      value: `${summary.utilization.toFixed(1)}%`,
      note: "Overall utilization rate",
      icon: ChartNoAxesCombined,
      color: "purple",
    },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setForm({
      organization: "",
      category: "",
      allocated: "",
    });
  };

  const handleAddBudget = (e) => {
    e.preventDefault();

    const organization = form.organization.trim();
    const category = form.category.trim();
    const amount = Number(form.allocated);

    if (!organization || !category) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter a valid budget amount greater than zero.");
      return;
    }

    const newBudget = {
      id: crypto.randomUUID(),
      organization,
      category,
      allocated: amount,
      spent: 0,
    };

    setBudgets((previous) => [...previous, newBudget]);
    closeModal();
  };

  return (
    <div className="budget-page">
      {/* Page Header */}
      <div className="budget-header">
        <div>
          <h1>Budget Management</h1>
          <p>
            Manage budget allocations, monitor expenses,
            and track remaining funds.
          </p>
        </div>

        <button
          type="button"
          className="budget-btn budget-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      <section
        className="budget-summary"
        aria-label="Budget Summary"
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={`budget-summary-card ${card.color}`}
            >
              <div className="budget-card-top">
                <span>{card.label}</span>

                <div className="budget-card-icon">
                  <Icon size={20} />
                </div>
              </div>

              <h2>{card.value}</h2>
              <small>{card.note}</small>
            </div>
          );
        })}
      </section>

   
      <section className="budget-panel">
        <div className="budget-panel-header">
          <div>
            <h2>Overall Budget Utilization</h2>
            <p>
              Overview of allocated versus utilized funds
            </p>
          </div>

          <span className="budget-percentage">
            {summary.utilization.toFixed(1)}%
          </span>
        </div>

        <div className="budget-overview-values">
          <div>
            <span>Total Allocated</span>
            <strong>
              {formatMoney(summary.totalBudget)}
            </strong>
          </div>

          <div>
            <span>Total Used</span>
            <strong>
              {formatMoney(summary.budgetUsed)}
            </strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>
              {formatMoney(summary.remainingBudget)}
            </strong>
          </div>
        </div>

        <div
          className="budget-progress"
          role="progressbar"
          aria-label="Overall budget utilization"
          aria-valuenow={summary.utilization}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="budget-progress-fill"
            style={{
              width: `${Math.min(summary.utilization, 100)}%`,
            }}
          />
        </div>
      </section>

     
      <div className="budget-filters">
        <div className="budget-filter-group">
          <label htmlFor="budget-search">
            Search Budget
          </label>

          <div className="budget-search-field">
            <Search size={17} />

            <input
              id="budget-search"
              type="search"
              placeholder="Search organization or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="budget-filter-group">
          <label htmlFor="budget-status">
            Budget Status
          </label>

          <select
            id="budget-status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option value="Within Budget">
              Within Budget
            </option>
            <option value="Near Limit">Near Limit</option>
            <option value="Fully Utilized">
              Fully Utilized
            </option>
          </select>
        </div>
      </div>

     
      <section className="budget-panel">
        <div className="budget-panel-header">
          <div>
            <h2>Budget Allocations</h2>
            <p>
              Showing {filteredBudgets.length} of{" "}
              {budgets.length} budget records
            </p>
          </div>
        </div>

        <div className="budget-table-wrapper">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Category</th>
                <th>Allocated</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((budget) => {
                  const remaining =
                    budget.allocated - budget.spent;

                  const utilization =
                    getUtilization(budget);

                  const status = getBudgetStatus(budget);

                  return (
                    <tr key={budget.id}>
                      <td>{budget.organization}</td>
                      <td>{budget.category}</td>

                      <td className="budget-money">
                        {formatMoney(budget.allocated)}
                      </td>

                      <td className="budget-money">
                        {formatMoney(budget.spent)}
                      </td>

                      <td className="budget-money">
                        {formatMoney(remaining)}
                      </td>

                      <td>
                        <div className="budget-table-progress">
                          <div className="budget-mini-progress">
                            <div
                              style={{
                                width: `${Math.min(
                                  utilization,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span>
                            {utilization.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`budget-status ${
                            status === "Near Limit"
                              ? "warning"
                              : status === "Fully Utilized"
                              ? "danger"
                              : "success"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="budget-empty"
                  >
                    No matching budget records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="budget-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-budget-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="budget-modal-header">
              <div>
                <h2 id="add-budget-title">
                  Add Budget Allocation
                </h2>

                <p>
                  Create a new organization budget record.
                </p>
              </div>

              <button
                type="button"
                className="budget-close-btn"
                aria-label="Close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBudget}>
              <div className="budget-form-group">
                <label htmlFor="budget-organization">
                  Organization
                </label>

                <input
                  id="budget-organization"
                  type="text"
                  placeholder="Enter organization name"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      organization: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="budget-form-group">
                <label htmlFor="budget-category">
                  Budget Category
                </label>

                <input
                  id="budget-category"
                  type="text"
                  placeholder="e.g. Student Activities"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="budget-form-group">
                <label htmlFor="budget-amount">
                  Allocated Amount (PHP)
                </label>

                <input
                  id="budget-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.allocated}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allocated: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {formError && (
                <p className="budget-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="budget-modal-actions">
                <button
                  type="button"
                  className="budget-btn budget-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="budget-btn budget-btn-primary"
                >
                  <CircleDollarSign size={17} />
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
