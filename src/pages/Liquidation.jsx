import React, { useState, useEffect } from "react";
import {
  Receipt,
  Wallet,
  FileCheck,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  RotateCcw,
  Building2,
  CheckCircle2,
} from "lucide-react";
import "../styles/liquidation.css";

const INITIAL_LIQUIDATIONS = [
  {
    id: "liq-1",
    orgCode: "ITS",
    orgName: "Information Technology Society (ITS)",
    eventName: "IT Week & Hackathon 2026",
    cashAdvance: 15000,
    dateReleased: "2026-11-02",
    status: "Pending",
    expenses: [
      { id: 1, orNumber: "OR-10421", description: "Event Tarpaulin & Stage Backdrop", category: "Printing", amount: 2400, date: "2026-11-04" },
      { id: 2, orNumber: "OR-10455", description: "Speakers & Guests Packed Meals", category: "Food & Catering", amount: 6500, date: "2026-11-05" },
      { id: 3, orNumber: "OR-10489", description: "Winners Trophies & Printed Certificates", category: "Awards & Supplies", amount: 3100, date: "2026-11-05" },
    ],
  },
  {
    id: "liq-2",
    orgCode: "SSC",
    orgName: "Supreme Student Council (SSC)",
    eventName: "University Leadership Summit",
    cashAdvance: 25000,
    dateReleased: "2026-10-20",
    status: "Liquidated",
    expenses: [
      { id: 101, orNumber: "OR-98210", description: "Sound System & LED Wall Rental", category: "Equipment", amount: 12000, date: "2026-10-24" },
      { id: 102, orNumber: "OR-98244", description: "Delegate Kits, IDs & Lanyards", category: "Supplies", amount: 8500, date: "2026-10-25" },
      { id: 103, orNumber: "OR-98301", description: "Refreshments & Bottled Water", category: "Food & Catering", amount: 4500, date: "2026-10-25" },
    ],
  },
  {
    id: "liq-3",
    orgCode: "JPIA",
    orgName: "Junior Philippine Institute of Accountants (JPIA)",
    eventName: "Accounting Quiz Bowl",
    cashAdvance: 8000,
    dateReleased: "2026-11-08",
    status: "Pending",
    expenses: [
      { id: 201, orNumber: "OR-55102", description: "Quiz Buzzer Rental & Answer Boards", category: "Equipment", amount: 3200, date: "2026-11-10" },
    ],
  },
];

export default function Liquidation() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("plmun_liquidations");
    return saved ? JSON.parse(saved) : INITIAL_LIQUIDATIONS;
  });

  const [selectedId, setSelectedId] = useState(records[0]?.id || "liq-1");

  // New Cash Advance / Event form states
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newOrgCode, setNewOrgCode] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newCashAdvance, setNewCashAdvance] = useState("");

  // States for editing an event card's name & organization
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventName, setEditEventName] = useState("");
  const [editEventOrgName, setEditEventOrgName] = useState("");
  const [editEventOrgCode, setEditEventOrgCode] = useState("");

  // Edit Cash Advance amount inline
  const [isEditingAdvance, setIsEditingAdvance] = useState(false);
  const [advanceInput, setAdvanceInput] = useState("");

  // Add new Receipt / Expense item form states
  const [orNumber, setOrNumber] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Catering");
  const [amount, setAmount] = useState("");

  // Inline edit for an expense row
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editExpenseForm, setEditExpenseForm] = useState({
    orNumber: "",
    description: "",
    category: "",
    amount: "",
  });

  useEffect(() => {
    localStorage.setItem("plmun_liquidations", JSON.stringify(records));
  }, [records]);

  const currentRecord = records.find((r) => r.id === selectedId) || records[0];

  // Financial Calculations
  const totalLiquidated = currentRecord.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const balanceDifference = currentRecord.cashAdvance - totalLiquidated;
  const isOverspent = balanceDifference < 0;
  const liquidationPercent =
    currentRecord.cashAdvance > 0
      ? Math.min(100, Math.round((totalLiquidated / currentRecord.cashAdvance) * 100))
      : 0;

  // Add new Event Cash Advance
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventName.trim() || !newOrgName.trim()) return;

    const code =
      newOrgCode.trim().toUpperCase() ||
      newOrgName
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);

    const newRecord = {
      id: `liq-${Date.now()}`,
      orgCode: code,
      orgName: newOrgName.trim(),
      eventName: newEventName.trim(),
      cashAdvance: parseFloat(newCashAdvance) || 0,
      dateReleased: new Date().toISOString().split("T")[0],
      status: "Pending",
      expenses: [],
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSelectedId(newRecord.id);
    setNewOrgCode("");
    setNewOrgName("");
    setNewEventName("");
    setNewCashAdvance("");
    setIsAddingEvent(false);
  };

  // Start editing an event card's name
  const startEditingEvent = (e, rec) => {
    e.stopPropagation();
    setEditingEventId(rec.id);
    setEditEventName(rec.eventName);
    setEditEventOrgName(rec.orgName);
    setEditEventOrgCode(rec.orgCode);
  };

  // Save edited event card name
  const saveEditEvent = (e, recId) => {
    e.stopPropagation();
    if (!editEventName.trim()) return;

    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === recId
          ? {
              ...rec,
              eventName: editEventName.trim(),
              orgName: editEventOrgName.trim() || rec.orgName,
              orgCode: editEventOrgCode.trim().toUpperCase() || rec.orgCode,
            }
          : rec
      )
    );
    setEditingEventId(null);
  };

  // Delete an Event Cash Advance card
  const handleDeleteEvent = (e, id) => {
    e.stopPropagation();
    if (records.length <= 1) return;
    const filtered = records.filter((r) => r.id !== id);
    setRecords(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  // Toggle status between Pending and Liquidated
  const toggleLiquidationStatus = () => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === currentRecord.id
          ? { ...rec, status: rec.status === "Liquidated" ? "Pending" : "Liquidated" }
          : rec
      )
    );
  };

  // Save edited Cash Advance amount
  const handleSaveAdvance = () => {
    const val = parseFloat(advanceInput);
    if (!isNaN(val) && val >= 0) {
      setRecords((prev) =>
        prev.map((rec) => (rec.id === currentRecord.id ? { ...rec, cashAdvance: val } : rec))
      );
    }
    setIsEditingAdvance(false);
  };

  // Add new Receipt / Expense item
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const newExpense = {
      id: Date.now(),
      orNumber: orNumber.trim() || "N/A",
      description: description.trim(),
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
    };

    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === currentRecord.id
          ? { ...rec, expenses: [newExpense, ...rec.expenses] }
          : rec
      )
    );

    setOrNumber("");
    setDescription("");
    setCategory("Food & Catering");
    setAmount("");
  };

  // Start editing receipt row
  const startEditingExpense = (item) => {
    setEditingExpenseId(item.id);
    setEditExpenseForm({
      orNumber: item.orNumber,
      description: item.description,
      category: item.category,
      amount: item.amount,
    });
  };

  // Save edited receipt row
  const saveExpenseEdit = (expenseId) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== currentRecord.id) return rec;
        return {
          ...rec,
          expenses: rec.expenses.map((exp) =>
            exp.id === expenseId
              ? {
                  ...exp,
                  orNumber: editExpenseForm.orNumber.trim() || "N/A",
                  description: editExpenseForm.description,
                  category: editExpenseForm.category,
                  amount: parseFloat(editExpenseForm.amount) || 0,
                }
              : exp
          ),
        };
      })
    );
    setEditingExpenseId(null);
  };

  // Delete receipt row
  const handleDeleteExpense = (expenseId) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === currentRecord.id
          ? { ...rec, expenses: rec.expenses.filter((exp) => exp.id !== expenseId) }
          : rec
      )
    );
  };

  // Reset demo data
  const handleResetDemo = () => {
    localStorage.removeItem("plmun_liquidations");
    setRecords(INITIAL_LIQUIDATIONS);
    setSelectedId(INITIAL_LIQUIDATIONS[0].id);
    setEditingExpenseId(null);
    setEditingEventId(null);
    setIsAddingEvent(false);
  };

  const formatPHP = (num) =>
    `₱${Math.abs(Number(num)).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="lq-container">
      {/* Header */}
      <div className="lq-header">
        <div>
          <h1>Liquidation Management</h1>
          <p>Audit event cash advances, record official receipts, and track unspent funds for return</p>
        </div>

        <div className="lq-header-actions">
          <button
            type="button"
            className="lq-primary-btn"
            onClick={() => setIsAddingEvent((prev) => !prev)}
          >
            <Plus size={16} /> {isAddingEvent ? "Close Form" : "New Cash Advance"}
          </button>

          <button type="button" className="lq-reset-btn" onClick={handleResetDemo}>
            <RotateCcw size={16} /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Collapsible Form: Add New Event Cash Advance */}
      {isAddingEvent && (
        <div className="lq-panel lq-add-panel">
          <h3>Record New Event Cash Advance for Liquidation</h3>
          <form className="lq-form" onSubmit={handleAddEvent}>
            <div className="lq-field">
              <label>Organization Name</label>
              <input
                type="text"
                placeholder="e.g., Information Technology Society"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="lq-field">
              <label>Org Acronym</label>
              <input
                type="text"
                placeholder="e.g., ITS"
                maxLength={10}
                value={newOrgCode}
                onChange={(e) => setNewOrgCode(e.target.value)}
              />
            </div>

            <div className="lq-field">
              <label>Event / Activity Name</label>
              <input
                type="text"
                placeholder="e.g., General Assembly 2026"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                required
              />
            </div>

            <div className="lq-field">
              <label>Cash Advance Released (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 10000"
                value={newCashAdvance}
                onChange={(e) => setNewCashAdvance(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="lq-submit-btn">
              <Check size={18} /> Create Record
            </button>
          </form>
        </div>
      )}

      {/* Section 1: Event Cash Advance Cards */}
      <div className="lq-cards-grid">
        {records.map((rec) => {
          const spent = rec.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
          const diff = rec.cashAdvance - spent;
          const pct = rec.cashAdvance > 0 ? Math.min(100, Math.round((spent / rec.cashAdvance) * 100)) : 0;
          const isSelected = rec.id === currentRecord.id;
          const isEditingThisCard = editingEventId === rec.id;

          return (
            <div
              key={rec.id}
              className={`lq-event-card ${isSelected ? "active" : ""}`}
              onClick={() => {
                setSelectedId(rec.id);
                setEditingExpenseId(null);
                setIsEditingAdvance(false);
              }}
            >
              <div className="lq-card-top">
                <span className="lq-org-badge">
                  <Building2 size={13} /> {rec.orgCode}
                </span>

                <div className="lq-card-badges">
                  <span className={`lq-status-pill ${rec.status.toLowerCase()}`}>
                    {rec.status}
                  </span>
                  {!isEditingThisCard && (
                    <>
                      <button
                        type="button"
                        className="lq-icon-btn"
                        onClick={(e) => startEditingEvent(e, rec)}
                        title="Edit Event Name"
                      >
                        <Pencil size={14} />
                      </button>
                      {records.length > 1 && (
                        <button
                          type="button"
                          className="lq-icon-btn danger"
                          onClick={(e) => handleDeleteEvent(e, rec.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEditingThisCard ? (
                <div
                  className="lq-card-edit-box"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    className="lq-card-edit-input"
                    value={editEventName}
                    onChange={(e) => setEditEventName(e.target.value)}
                    placeholder="Event Name"
                    autoFocus
                  />
                  <input
                    type="text"
                    className="lq-card-edit-input sub"
                    value={editEventOrgName}
                    onChange={(e) => setEditEventOrgName(e.target.value)}
                    placeholder="Organization Name"
                  />
                  <div className="lq-card-edit-row">
                    <input
                      type="text"
                      className="lq-card-edit-code"
                      value={editEventOrgCode}
                      onChange={(e) => setEditEventOrgCode(e.target.value)}
                      placeholder="Acronym"
                      maxLength={10}
                    />
                    <div className="lq-actions">
                      <button
                        type="button"
                        className="btn-save-sm"
                        onClick={(e) => saveEditEvent(e, rec.id)}
                        title="Save Event Name"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEventId(null);
                        }}
                        title="Cancel"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{rec.eventName}</h3>
                  <p className="lq-org-sub">{rec.orgName}</p>
                </>
              )}

              <div className="lq-progress-bar">
                <div className="lq-progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <div className="lq-card-footer">
                <div>
                  <small>Liquidated</small>
                  <p className="text-green">
                    {formatPHP(spent)} / {formatPHP(rec.cashAdvance)}
                  </p>
                </div>
                <div className="text-right">
                  <small>{diff < 0 ? "Overspent" : "Unspent Cash"}</small>
                  <p className={diff < 0 ? "text-red" : "text-amber"}>{formatPHP(diff)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Selected Event Financial Summary */}
      <div className="lq-kpi-grid">
        <div className="lq-kpi-card">
          <div className="lq-kpi-top">
            <span>Cash Advance Released</span>
            <Wallet size={20} className="icon-blue" />
          </div>
          {isEditingAdvance ? (
            <div className="lq-inline-edit-box">
              <input
                type="number"
                value={advanceInput}
                onChange={(e) => setAdvanceInput(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={handleSaveAdvance} className="btn-save-sm">
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setIsEditingAdvance(false)} className="btn-cancel-sm">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="lq-kpi-val-row">
              <h2>{formatPHP(currentRecord.cashAdvance)}</h2>
              <button
                type="button"
                className="lq-icon-btn"
                onClick={() => {
                  setAdvanceInput(currentRecord.cashAdvance);
                  setIsEditingAdvance(true);
                }}
                title="Edit Cash Advance Amount"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
          <small>Released on {currentRecord.dateReleased}</small>
        </div>

        <div className="lq-kpi-card">
          <div className="lq-kpi-top">
            <span>Total Liquidated (Receipts)</span>
            <Receipt size={20} className="icon-green" />
          </div>
          <h2 className="text-green">{formatPHP(totalLiquidated)}</h2>
          <small>{liquidationPercent}% accounted with official receipts</small>
        </div>

        <div className="lq-kpi-card">
          <div className="lq-kpi-top">
            <span>{isOverspent ? "For Reimbursement (Overspent)" : "Unspent Cash (To Return)"}</span>
            <AlertCircle size={20} className={isOverspent ? "icon-red" : "icon-amber"} />
          </div>
          <h2 className={isOverspent ? "text-red" : "text-amber"}>
            {formatPHP(balanceDifference)}
          </h2>
          <small>
            {isOverspent
              ? "Exceeds released cash advance"
              : balanceDifference === 0
              ? "Exact amount liquidated"
              : "Remaining cash to be returned to treasury"}
          </small>
        </div>

        <div className="lq-kpi-card">
          <div className="lq-kpi-top">
            <span>Liquidation Status</span>
            <FileCheck size={20} className="icon-purple" />
          </div>
          <div className="lq-status-action-row">
            <span className={`lq-status-pill lg ${currentRecord.status.toLowerCase()}`}>
              {currentRecord.status}
            </span>
            <button
              type="button"
              className="lq-toggle-status-btn"
              onClick={toggleLiquidationStatus}
            >
              <CheckCircle2 size={15} />
              {currentRecord.status === "Liquidated" ? "Reopen" : "Mark Cleared"}
            </button>
          </div>
          <small>{currentRecord.expenses.length} official receipt(s) attached</small>
        </div>
      </div>

      {/* Section 3: Add Expense / Receipt Form */}
      <div className="lq-panel">
        <h3>Record Official Receipt / Expense — {currentRecord.eventName}</h3>
        <form className="lq-form" onSubmit={handleAddExpense}>
          <div className="lq-field">
            <label>OR / Receipt No.</label>
            <input
              type="text"
              placeholder="e.g., OR-10512"
              value={orNumber}
              onChange={(e) => setOrNumber(e.target.value)}
              required
            />
          </div>

          <div className="lq-field">
            <label>Expense Description</label>
            <input
              type="text"
              placeholder="e.g., Catering for Volunteers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="lq-field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food & Catering">Food & Catering</option>
              <option value="Printing">Printing</option>
              <option value="Equipment">Equipment</option>
              <option value="Awards & Supplies">Awards & Supplies</option>
              <option value="Transportation">Transportation</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="lq-field">
            <label>Amount (₱)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g., 2500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="lq-submit-btn">
            <Plus size={18} /> Add Receipt
          </button>
        </form>
      </div>

      {/* Section 4: Itemized Receipts Table */}
      <div className="lq-panel">
        <div className="lq-table-header">
          <h3>Itemized Liquidation Breakdown ({currentRecord.expenses.length})</h3>
          <small>Edit or remove receipt entries anytime</small>
        </div>

        <div className="lq-table-wrapper">
          <table className="lq-table">
            <thead>
              <tr>
                <th>OR / Receipt #</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecord.expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="lq-empty-row">
                    No receipts recorded for {currentRecord.eventName} yet. Add an expense above.
                  </td>
                </tr>
              ) : (
                currentRecord.expenses.map((item) => (
                  <tr key={item.id}>
                    {editingExpenseId === item.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="lq-inline-input sm"
                            value={editExpenseForm.orNumber}
                            onChange={(e) =>
                              setEditExpenseForm({ ...editExpenseForm, orNumber: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="lq-inline-input"
                            value={editExpenseForm.description}
                            onChange={(e) =>
                              setEditExpenseForm({ ...editExpenseForm, description: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="lq-inline-select"
                            value={editExpenseForm.category}
                            onChange={(e) =>
                              setEditExpenseForm({ ...editExpenseForm, category: e.target.value })
                            }
                          >
                            <option value="Food & Catering">Food & Catering</option>
                            <option value="Printing">Printing</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Awards & Supplies">Awards & Supplies</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                          </select>
                        </td>
                        <td>{item.date}</td>
                        <td>
                          <input
                            type="number"
                            className="lq-inline-input sm"
                            value={editExpenseForm.amount}
                            onChange={(e) =>
                              setEditExpenseForm({ ...editExpenseForm, amount: e.target.value })
                            }
                          />
                        </td>
                        <td className="lq-actions">
                          <button
                            type="button"
                            className="btn-save-sm"
                            onClick={() => saveExpenseEdit(item.id)}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-cancel-sm"
                            onClick={() => setEditingExpenseId(null)}
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="font-mono">{item.orNumber}</td>
                        <td className="font-semibold">{item.description}</td>
                        <td>
                          <span className="lq-cat-tag">{item.category}</span>
                        </td>
                        <td>{item.date}</td>
                        <td className="font-semibold text-green">{formatPHP(item.amount)}</td>
                        <td className="lq-actions">
                          <button
                            type="button"
                            className="btn-edit-sm"
                            onClick={() => startEditingExpense(item)}
                            title="Edit Receipt"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-delete-sm"
                            onClick={() => handleDeleteExpense(item.id)}
                            title="Delete Receipt"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}