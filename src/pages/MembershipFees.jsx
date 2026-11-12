import React, { useState, useEffect } from "react";
import {
  Building2,
  Wallet,
  PiggyBank,
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import "../styles/membershipFees.css";

const INITIAL_DATA = [
  {
    id: "ssc",
    code: "SSC",
    name: "Supreme Student Council (SSC)",
    targetAmount: 45000,
    remittances: [
      { id: 1, block: "BSIT 1 - Block A", amount: 6000, studentsPaid: 40, date: "2026-11-05", status: "Completed" },
      { id: 2, block: "BSIT 1 - Block B", amount: 5250, studentsPaid: 35, date: "2026-11-08", status: "Partial" },
      { id: 3, block: "BSCS 2 - Block A", amount: 6750, studentsPaid: 45, date: "2026-11-10", status: "Completed" },
    ],
  },
  {
    id: "its",
    code: "ITS",
    name: "Information Technology Society (ITS)",
    targetAmount: 30000,
    remittances: [
      { id: 101, block: "BSIT 1 - Block A", amount: 4000, studentsPaid: 40, date: "2026-11-06", status: "Completed" },
      { id: 102, block: "BSIT 1 - Block C", amount: 3500, studentsPaid: 35, date: "2026-11-11", status: "Partial" },
    ],
  },
  {
    id: "jpia",
    code: "JPIA",
    name: "Junior Philippine Institute of Accountants (JPIA)",
    targetAmount: 24000,
    remittances: [
      { id: 201, block: "BSA 1 - Block A", amount: 4800, studentsPaid: 40, date: "2026-11-09", status: "Completed" },
    ],
  },
];

export default function MembershipFees() {
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem("plmun_membership_fees");
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || "ssc");

  // States for adding a new organization
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgCode, setNewOrgCode] = useState("");
  const [newOrgTarget, setNewOrgTarget] = useState("");

  // States for editing an organization's name/code
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgCode, setEditOrgCode] = useState("");

  // Form states for adding a new block remittance
  const [blockName, setBlockName] = useState("");
  const [amountRemitted, setAmountRemitted] = useState("");
  const [studentsPaid, setStudentsPaid] = useState("");
  const [status, setStatus] = useState("Partial");

  // State for editing an existing block row
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ block: "", amount: "", studentsPaid: "", status: "" });

  // State for editing an organization's target fee
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("");

  useEffect(() => {
    localStorage.setItem("plmun_membership_fees", JSON.stringify(organizations));
  }, [organizations]);

  const currentOrg = organizations.find((org) => org.id === selectedOrgId) || organizations[0];

  // Calculations for selected organization
  const totalRemitted = currentOrg.remittances.reduce((sum, item) => sum + Number(item.amount), 0);
  const remainingBalance = Math.max(0, currentOrg.targetAmount - totalRemitted);
  const collectionPercent =
    currentOrg.targetAmount > 0
      ? Math.min(100, Math.round((totalRemitted / currentOrg.targetAmount) * 100))
      : 0;

  // Add a new organization
  const handleAddOrg = (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const generatedCode =
      newOrgCode.trim().toUpperCase() ||
      newOrgName
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);

    const newOrg = {
      id: `org-${Date.now()}`,
      code: generatedCode,
      name: newOrgName.trim(),
      targetAmount: parseFloat(newOrgTarget) || 0,
      remittances: [],
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setSelectedOrgId(newOrg.id);
    setNewOrgName("");
    setNewOrgCode("");
    setNewOrgTarget("");
    setIsAddingOrg(false);
  };

  // Start editing an organization name
  const startEditingOrg = (e, org) => {
    e.stopPropagation();
    setEditingOrgId(org.id);
    setEditOrgName(org.name);
    setEditOrgCode(org.code || org.id.toUpperCase());
  };

  // Save edited organization name
  const saveEditOrg = (e, orgId) => {
    e.stopPropagation();
    if (!editOrgName.trim()) return;

    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? {
              ...org,
              name: editOrgName.trim(),
              code: editOrgCode.trim().toUpperCase() || org.code || org.id.toUpperCase(),
            }
          : org
      )
    );
    setEditingOrgId(null);
  };

  // Delete an organization (keeps at least 1 organization)
  const handleDeleteOrg = (e, orgId) => {
    e.stopPropagation();
    if (organizations.length <= 1) return;

    const updated = organizations.filter((org) => org.id !== orgId);
    setOrganizations(updated);
    if (selectedOrgId === orgId) {
      setSelectedOrgId(updated[0].id);
    }
  };

  // Add a new block remittance
  const handleAddRemittance = (e) => {
    e.preventDefault();
    if (!blockName.trim() || !amountRemitted) return;

    const newEntry = {
      id: Date.now(),
      block: blockName.trim(),
      amount: parseFloat(amountRemitted),
      studentsPaid: parseInt(studentsPaid, 10) || 0,
      date: new Date().toISOString().split("T")[0],
      status,
    };

    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === currentOrg.id
          ? { ...org, remittances: [newEntry, ...org.remittances] }
          : org
      )
    );

    setBlockName("");
    setAmountRemitted("");
    setStudentsPaid("");
    setStatus("Partial");
  };

  // Start inline editing a block row
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm({
      block: item.block,
      amount: item.amount,
      studentsPaid: item.studentsPaid,
      status: item.status,
    });
  };

  // Save edited block row
  const saveEdit = (id) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== currentOrg.id) return org;
        return {
          ...org,
          remittances: org.remittances.map((item) =>
            item.id === id
              ? {
                  ...item,
                  block: editForm.block,
                  amount: parseFloat(editForm.amount) || 0,
                  studentsPaid: parseInt(editForm.studentsPaid, 10) || 0,
                  status: editForm.status,
                }
              : item
          ),
        };
      })
    );
    setEditingId(null);
  };

  // Delete a block entry
  const handleDelete = (id) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === currentOrg.id
          ? { ...org, remittances: org.remittances.filter((item) => item.id !== id) }
          : org
      )
    );
  };

  // Update Target Fee for selected organization
  const handleSaveTarget = () => {
    const newTarget = parseFloat(targetInput);
    if (!isNaN(newTarget) && newTarget >= 0) {
      setOrganizations((prev) =>
        prev.map((org) => (org.id === currentOrg.id ? { ...org, targetAmount: newTarget } : org))
      );
    }
    setIsEditingTarget(false);
  };

  // Reset to starter demo data
  const handleResetDemo = () => {
    localStorage.removeItem("plmun_membership_fees");
    setOrganizations(INITIAL_DATA);
    setSelectedOrgId(INITIAL_DATA[0].id);
    setEditingOrgId(null);
    setIsAddingOrg(false);
  };

  const formatPHP = (num) =>
    `₱${Number(num).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="mf-container">
      {/* Page Header */}
      <div className="mf-header">
        <div>
          <h1>Membership Fees Dashboard</h1>
          <p>Track remaining membership fee balances and block/section remittances per organization</p>
        </div>

        <div className="mf-header-actions">
          <button
            type="button"
            className="mf-primary-btn"
            onClick={() => setIsAddingOrg((prev) => !prev)}
          >
            <Plus size={16} /> {isAddingOrg ? "Close Form" : "Add Organization"}
          </button>

          <button
            type="button"
            className="mf-reset-btn"
            onClick={handleResetDemo}
            title="Reset sample data"
          >
            <RotateCcw size={16} /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Add New Organization Form (Collapsible) */}
      {isAddingOrg && (
        <div className="mf-panel mf-add-org-panel">
          <h3>Add New Student Organization</h3>
          <form className="mf-form" onSubmit={handleAddOrg}>
            <div className="mf-field">
              <label>Organization Name</label>
              <input
                type="text"
                placeholder="e.g., Association of Computer Engineering Students"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mf-field">
              <label>Acronym / Short Code</label>
              <input
                type="text"
                placeholder="e.g., ACES"
                maxLength={10}
                value={newOrgCode}
                onChange={(e) => setNewOrgCode(e.target.value)}
              />
            </div>

            <div className="mf-field">
              <label>Target Membership Fee (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 25000"
                value={newOrgTarget}
                onChange={(e) => setNewOrgTarget(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="mf-add-btn">
              <Check size={18} /> Save Organization
            </button>
          </form>
        </div>
      )}

      {/* Section 1: Summary Per Organization */}
      <div className="mf-org-overview">
        {organizations.map((org) => {
          const collected = org.remittances.reduce((sum, r) => sum + Number(r.amount), 0);
          const left = Math.max(0, org.targetAmount - collected);
          const pct =
            org.targetAmount > 0
              ? Math.min(100, Math.round((collected / org.targetAmount) * 100))
              : 0;
          const isSelected = org.id === currentOrg.id;
          const isEditingThisOrg = editingOrgId === org.id;

          return (
            <div
              key={org.id}
              className={`mf-org-card ${isSelected ? "active" : ""}`}
              onClick={() => {
                setSelectedOrgId(org.id);
                setEditingId(null);
                setIsEditingTarget(false);
              }}
            >
              <div className="mf-org-card-top">
                <span className="mf-org-badge">
                  <Building2 size={14} /> {org.code || org.id.toUpperCase()}
                </span>

                <div className="mf-org-card-controls">
                  <span className="mf-pct-text">{pct}% Collected</span>
                  {!isEditingThisOrg && (
                    <>
                      <button
                        type="button"
                        className="mf-org-icon-btn"
                        onClick={(e) => startEditingOrg(e, org)}
                        title="Edit Organization Name"
                      >
                        <Pencil size={14} />
                      </button>
                      {organizations.length > 1 && (
                        <button
                          type="button"
                          className="mf-org-icon-btn danger"
                          onClick={(e) => handleDeleteOrg(e, org.id)}
                          title="Delete Organization"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEditingThisOrg ? (
                <div
                  className="mf-org-edit-box"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    className="mf-org-edit-input"
                    value={editOrgName}
                    onChange={(e) => setEditOrgName(e.target.value)}
                    placeholder="Organization Name"
                    autoFocus
                  />
                  <div className="mf-org-edit-row">
                    <input
                      type="text"
                      className="mf-org-edit-code"
                      value={editOrgCode}
                      onChange={(e) => setEditOrgCode(e.target.value)}
                      placeholder="Acronym"
                      maxLength={10}
                    />
                    <div className="mf-actions">
                      <button
                        type="button"
                        className="btn-save-sm"
                        onClick={(e) => saveEditOrg(e, org.id)}
                        title="Save Name"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOrgId(null);
                        }}
                        title="Cancel"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <h3>{org.name}</h3>
              )}

              <div className="mf-progress-bar">
                <div className="mf-progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <div className="mf-org-card-footer">
                <div>
                  <small>Remitted</small>
                  <p className="text-green">{formatPHP(collected)}</p>
                </div>
                <div className="text-right">
                  <small>Still Left</small>
                  <p className="text-amber">{formatPHP(left)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Selected Organization KPI Breakdown */}
      <div className="mf-kpi-grid">
        <div className="mf-kpi-card">
          <div className="mf-kpi-top">
            <span>Target Membership Fee</span>
            <Wallet size={20} className="icon-blue" />
          </div>
          {isEditingTarget ? (
            <div className="mf-target-edit">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={handleSaveTarget} className="btn-save-sm">
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setIsEditingTarget(false)} className="btn-cancel-sm">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="mf-kpi-value-row">
              <h2>{formatPHP(currentOrg.targetAmount)}</h2>
              <button
                type="button"
                className="mf-edit-target-btn"
                onClick={() => {
                  setTargetInput(currentOrg.targetAmount);
                  setIsEditingTarget(true);
                }}
                title="Edit Target Fee"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
          <small>Expected total for {currentOrg.name}</small>
        </div>

        <div className="mf-kpi-card">
          <div className="mf-kpi-top">
            <span>Total Remitted</span>
            <PiggyBank size={20} className="icon-green" />
          </div>
          <h2 className="text-green">{formatPHP(totalRemitted)}</h2>
          <small>{collectionPercent}% of target collected</small>
        </div>

        <div className="mf-kpi-card">
          <div className="mf-kpi-top">
            <span>Remaining Balance (Still Left)</span>
            <Wallet size={20} className="icon-amber" />
          </div>
          <h2 className="text-amber">{formatPHP(remainingBalance)}</h2>
          <small>Uncollected balance for this org</small>
        </div>

        <div className="mf-kpi-card">
          <div className="mf-kpi-top">
            <span>Remitting Blocks / Sections</span>
            <Users size={20} className="icon-purple" />
          </div>
          <h2>{currentOrg.remittances.length} Blocks</h2>
          <small>Sections with recorded payments</small>
        </div>
      </div>

      {/* Section 3: Record New Block Remittance Form */}
      <div className="mf-panel">
        <h3>Record Block / Section Remittance — {currentOrg.name}</h3>
        <form className="mf-form" onSubmit={handleAddRemittance}>
          <div className="mf-field">
            <label>Block / Section</label>
            <input
              type="text"
              placeholder="e.g., BSIT 1 - Block C"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              required
            />
          </div>

          <div className="mf-field">
            <label>Amount Remitted (₱)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g., 4500"
              value={amountRemitted}
              onChange={(e) => setAmountRemitted(e.target.value)}
              required
            />
          </div>

          <div className="mf-field">
            <label>No. of Students Paid</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 30"
              value={studentsPaid}
              onChange={(e) => setStudentsPaid(e.target.value)}
            />
          </div>

          <div className="mf-field">
            <label>Remittance Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Partial">Partial</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="mf-add-btn">
            <Plus size={18} /> Record Remittance
          </button>
        </form>
      </div>

      {/* Section 4: Editable Table of Blocks that Already Remitted */}
      <div className="mf-panel">
        <div className="mf-table-header">
          <h3>Remitted Blocks & Sections ({currentOrg.remittances.length})</h3>
          <small>Click the edit icon on any row to update the block or amount remitted</small>
        </div>

        <div className="mf-table-wrapper">
          <table className="mf-table">
            <thead>
              <tr>
                <th>Block / Section</th>
                <th>Students Paid</th>
                <th>Amount Remitted</th>
                <th>Date Recorded</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrg.remittances.length === 0 ? (
                <tr>
                  <td colSpan="6" className="mf-empty-row">
                    No blocks have remitted to {currentOrg.name} yet. Use the form above to record one.
                  </td>
                </tr>
              ) : (
                currentOrg.remittances.map((item) => (
                  <tr key={item.id}>
                    {editingId === item.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="mf-inline-input"
                            value={editForm.block}
                            onChange={(e) => setEditForm({ ...editForm, block: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="mf-inline-input sm"
                            value={editForm.studentsPaid}
                            onChange={(e) => setEditForm({ ...editForm, studentsPaid: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="mf-inline-input"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          />
                        </td>
                        <td>{item.date}</td>
                        <td>
                          <select
                            className="mf-inline-select"
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          >
                            <option value="Partial">Partial</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="mf-actions">
                          <button type="button" className="btn-save-sm" onClick={() => saveEdit(item.id)} title="Save">
                            <Check size={16} />
                          </button>
                          <button type="button" className="btn-cancel-sm" onClick={() => setEditingId(null)} title="Cancel">
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="font-semibold">{item.block}</td>
                        <td>{item.studentsPaid} students</td>
                        <td className="font-semibold text-green">{formatPHP(item.amount)}</td>
                        <td>{item.date}</td>
                        <td>
                          <span className={`mf-status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="mf-actions">
                          <button type="button" className="btn-edit-sm" onClick={() => startEditing(item)} title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button type="button" className="btn-delete-sm" onClick={() => handleDelete(item.id)} title="Delete">
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