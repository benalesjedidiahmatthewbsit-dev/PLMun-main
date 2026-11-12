
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Clock3,
  MapPin,
  Wallet,
} from "lucide-react";

import "../../styles/calendar.css";

const STORAGE_KEY = "plmun_calendar_activities";

const demoActivities = [
  {
    id: "1",
    title: "Leadership Seminar",
    organization: "Student Council",
    date: "2026-10-28",
    time: "09:00",
    location: "University Auditorium",
    budget: 15000,
    status: "Approved",
    description: "Leadership development seminar.",
  },
  {
    id: "2",
    title: "Community Outreach",
    organization: "Student Council",
    date: "2026-11-05",
    time: "08:00",
    location: "Community Center",
    budget: 20000,
    status: "Pending",
    description: "Community outreach program.",
  },
  {
    id: "3",
    title: "Student General Assembly",
    organization: "Student Council",
    date: "2026-11-12",
    time: "13:00",
    location: "University Gymnasium",
    budget: 8000,
    status: "Approved",
    description: "General assembly of members.",
  },
];

const emptyForm = {
  title: "",
  organization: "",
  date: "",
  time: "09:00",
  location: "",
  budget: "",
  status: "Pending",
  description: "",
};

const weekdays = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
];

const formatMoney = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(key) {
  return parseDate(key).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function loadActivities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return demoActivities;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : demoActivities;
  } catch {
    return demoActivities;
  }
}

export default function CalendarOfActivities() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    toDateKey(today)
  );

  const [activities, setActivities] = useState(loadActivities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const saveActivities = (updated) => {
    setActivities(updated);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch {
      // Data remains in React state if storage is unavailable.
    }
  };

  const changeMonth = (offset) => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + offset,
      1
    );

    setCurrentMonth(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
    setSelectedDate(toDateKey(now));
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();

    const daysInMonth = new Date(
      year, month + 1, 0
    ).getDate();

    const totalCells = Math.ceil(
      (startOffset + daysInMonth) / 7
    ) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(
        year, month, index - startOffset + 1
      );

      return {
        key: toDateKey(date),
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: toDateKey(date) === toDateKey(new Date()),
      };
    });
  }, [currentMonth]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesSearch = [
        activity.title,
        activity.organization,
        activity.location,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" ||
        activity.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activities, search, statusFilter]);

  const selectedActivities = useMemo(() => {
    return filteredActivities
      .filter((activity) => activity.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredActivities, selectedDate]);

  const monthActivities = useMemo(() => {
    const prefix = toDateKey(currentMonth).slice(0, 7);

    return filteredActivities
      .filter((activity) =>
        activity.date.startsWith(prefix)
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.time.localeCompare(b.time)
      );
  }, [filteredActivities, currentMonth]);

  const monthTotalBudget = monthActivities.reduce(
    (sum, item) => sum + Number(item.budget || 0),
    0
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: selectedDate,
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title,
      organization: activity.organization,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      budget: String(activity.budget),
      status: activity.status,
      description: activity.description || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError("");
    setForm(emptyForm);
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(form.budget);

    if (!form.title.trim() || !form.organization.trim() ||
        !form.date || !form.time) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.budget === "" ||
        !Number.isFinite(amount) ||
        amount < 0) {
      setError("Please enter a valid non-negative budget.");
      return;
    }

    const activity = {
      id: editingId || crypto.randomUUID(),
      title: form.title.trim(),
      organization: form.organization.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      budget: amount,
      status: form.status,
      description: form.description.trim(),
    };

    const updated = editingId
      ? activities.map((item) =>
          item.id === editingId ? activity : item
        )
      : [...activities, activity];

    saveActivities(updated);
    setSelectedDate(activity.date);

    const date = parseDate(activity.date);
    setCurrentMonth(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );

    closeModal();
  };

  const handleDelete = (activity) => {
    if (!window.confirm(
      `Delete "${activity.title}"?`
    )) return;

    saveActivities(
      activities.filter((item) => item.id !== activity.id)
    );
  };

  const monthLabel = currentMonth.toLocaleDateString(
    "en-PH",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="calendar-page">
      {/* Header */}
      <div className="calendar-header">
        <div>
          <h1>Calendar of Activities</h1>
          <p>
            Schedule and monitor student organization
            activities and their proposed budgets.
          </p>
        </div>

        <button
          type="button"
          className="calendar-btn calendar-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Summary */}
      <div className="calendar-summary">
        <div className="calendar-summary-card">
          <CalendarDays size={21} />
          <span>Monthly Activities</span>
          <strong>{monthActivities.length}</strong>
        </div>

        <div className="calendar-summary-card">
          <Clock3 size={21} />
          <span>Pending Activities</span>
          <strong>
            {monthActivities.filter(
              (item) => item.status === "Pending"
            ).length}
          </strong>
        </div>

        <div className="calendar-summary-card">
          <Wallet size={21} />
          <span>Proposed Activity Budgets</span>
          <strong>{formatMoney(monthTotalBudget)}</strong>
        </div>
      </div>

      {/* Filters */}
      <div className="calendar-filters">
        <div className="calendar-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            aria-label="Search activities"
          />
        </div>

        <select
          aria-label="Filter activities by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Calendar and Details */}
      <div className="calendar-layout">
        <section className="calendar-panel">
          <div className="calendar-toolbar">
            <h2>{monthLabel}</h2>

            <div className="calendar-navigation">
              <button type="button" onClick={goToToday}>
                Today
              </button>

              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {weekdays.map((day) => (
              <div
                className="calendar-weekday"
                key={day}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const events = filteredActivities.filter(
                (activity) => activity.date === day.key
              );

              return (
                <button
                  key={day.key}
                  type="button"
                  className={[
                    "calendar-day",
                    !day.isCurrentMonth ? "outside" : "",
                    day.isToday ? "today" : "",
                    selectedDate === day.key ? "selected" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => {
                    setSelectedDate(day.key);

                    if (!day.isCurrentMonth) {
                      const date = parseDate(day.key);
                      setCurrentMonth(
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          1
                        )
                      );
                    }
                  }}
                  aria-label={`${formatDate(day.key)}, ${events.length} activities`}
                  aria-pressed={selectedDate === day.key}
                >
                  <span className="calendar-day-number">
                    {day.day}
                  </span>

                  <div className="calendar-day-events">
                    {events.slice(0, 2).map((item) => (
                      <span
                        key={item.id}
                        className={`calendar-event-dot ${item.status.toLowerCase()}`}
                        title={item.title}
                      >
                        {item.title}
                      </span>
                    ))}

                    {events.length > 2 && (
                      <small>+{events.length - 2} more</small>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Day */}
        <aside className="calendar-panel calendar-details">
          <div className="calendar-details-header">
            <h2>{formatDate(selectedDate)}</h2>
            <p>
              {selectedActivities.length} scheduled activities
            </p>
          </div>

          <div className="calendar-activity-list">
            {selectedActivities.length === 0 ? (
              <div className="calendar-empty">
                <CalendarDays size={30} />
                <p>No activities scheduled for this date.</p>
              </div>
            ) : (
              selectedActivities.map((activity) => (
                <article
                  key={activity.id}
                  className="calendar-activity"
                >
                  <div className="calendar-activity-heading">
                    <h3>{activity.title}</h3>

                    <span className={`calendar-status ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  </div>

                  <p>{activity.organization}</p>

                  <div className="calendar-activity-meta">
                    <span>
                      <Clock3 size={14} />
                      {activity.time}
                    </span>

                    {activity.location && (
                      <span>
                        <MapPin size={14} />
                        {activity.location}
                      </span>
                    )}

                    <span>
                      <Wallet size={14} />
                      {formatMoney(activity.budget)}
                    </span>
                  </div>

                  {activity.description && (
                    <p className="calendar-description">
                      {activity.description}
                    </p>
                  )}

                  <div className="calendar-activity-actions">
                    <button
                      type="button"
                      onClick={() => openEditModal(activity)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(activity)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Monthly Activity List */}
      <section className="calendar-panel calendar-list-panel">
        <div className="calendar-list-header">
          <h2>Monthly Activity Schedule</h2>
          <p>{monthActivities.length} activities found</p>
        </div>

        <div className="calendar-table-wrapper">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Organization</th>
                <th>Location</th>
                <th>Proposed Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {monthActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="calendar-table-empty">
                    No activities found for this month.
                  </td>
                </tr>
              ) : (
                monthActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{formatDate(activity.date)}</td>
                    <td>{activity.title}</td>
                    <td>{activity.organization}</td>
                    <td>{activity.location || "—"}</td>
                    <td>{formatMoney(activity.budget)}</td>
                    <td>
                      <span className={`calendar-status ${activity.status.toLowerCase()}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td>
                      <div className="calendar-table-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${activity.title}`}
                          onClick={() => openEditModal(activity)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          aria-label={`Delete ${activity.title}`}
                          onClick={() => handleDelete(activity)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="calendar-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
          >
            <div className="calendar-modal-header">
              <div>
                <h2 id="calendar-modal-title">
                  {editingId ? "Edit Activity" : "Add Activity"}
                </h2>
                <p>Enter the activity information below.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="calendar-form-group">
                <label htmlFor="activity-title">
                  Activity Title *
                </label>
                <input
                  id="activity-title"
                  value={form.title}
                  onChange={(e) =>
                    updateForm("title", e.target.value)
                  }
                  required
                />
              </div>

              <div className="calendar-form-group">
                <label htmlFor="activity-organization">
                  Organization *
                </label>
                <input
                  id="activity-organization"
                  value={form.organization}
                  onChange={(e) =>
                    updateForm("organization", e.target.value)
                  }
                  required
                />
              </div>

              <div className="calendar-form-row">
                <div className="calendar-form-group">
                  <label htmlFor="activity-date">Date *</label>
                  <input
                    id="activity-date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      updateForm("date", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label htmlFor="activity-time">Time *</label>
                  <input
                    id="activity-time"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      updateForm("time", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="calendar-form-group">
                <label htmlFor="activity-location">
                  Location
                </label>
                <input
                  id="activity-location"
                  value={form.location}
                  onChange={(e) =>
                    updateForm("location", e.target.value)
                  }
                />
              </div>

              <div className="calendar-form-row">
                <div className="calendar-form-group">
                  <label htmlFor="activity-budget">
                    Proposed Budget (PHP) *
                  </label>
                  <input
                    id="activity-budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.budget}
                    onChange={(e) =>
                      updateForm("budget", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label htmlFor="activity-status">
                    Status
                  </label>
                  <select
                    id="activity-status"
                    value={form.status}
                    onChange={(e) =>
                      updateForm("status", e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="calendar-form-group">
                <label htmlFor="activity-description">
                  Description
                </label>
                <textarea
                  id="activity-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    updateForm("description", e.target.value)
                  }
                />
              </div>

              {error && (
                <p className="calendar-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="calendar-modal-actions">
                <button
                  type="button"
                  className="calendar-btn calendar-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="calendar-btn calendar-btn-primary"
                >
                  {editingId ? "Save Changes" : "Add Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
