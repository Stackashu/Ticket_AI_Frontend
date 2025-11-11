import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tickets.css";

// Simple Profile Icon SVG
const ProfileIcon = ({ size = 32 }) => (
  <svg
    height={size}
    viewBox="0 0 24 24"
    width={size}
    style={{ verticalAlign: "middle" }}
  >
    <circle cx="12" cy="8" r="4" fill="#555" />
    <ellipse cx="12" cy="17" rx="7" ry="5" fill="#aaa" />
  </svg>
);

const UserCard = ({ user, onClick, isSelected }) => (
  <div
    className={`user-card-bestui${isSelected ? " selected" : ""}`}
    onClick={() => onClick(user)}
    style={{
      border: isSelected ? "2px solid #4066d7" : "1px solid #e4eaf4",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "12px",
      cursor: "pointer",
      background: isSelected ? "#f3f8ff" : "#fff",
      boxShadow: isSelected ? "0 1px 5px rgba(64,102,215,0.10)" : "0 1px 3px rgba(180,195,255,0.06)",
      transition: "background 0.14s, border 0.14s"
    }}
  >
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <ProfileIcon size={28} />
      <div style={{ fontWeight: 500, fontSize: 18, marginLeft: 10 }}>
        {user.email 
          ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)
          : ""}
      </div>
      <div style={{
        marginLeft: "auto",
        fontSize: 13,
        color: "#8492ae",
        borderRadius: 4,
        padding: "2px 8px",
        background: "#eef2fd"
      }}>
        {user.role === "moderator" ? "Developer" : user.role}
      </div>
    </div>
    <div>
      <b>Email:</b> <span style={{ color: "#4066d7" }}>{user.email}</span>
    </div>
    <div style={{ marginTop: 4 }}>
      <b>Skills:</b>{" "}
      {(user.skills && user.skills.length > 0) ? (
        user.skills.map((s, i) => (
          <span
            key={i}
            style={{
              background: "#e5f1fa",
              color: "#2c608f",
              padding: "2px 7px",
              borderRadius: "10px",
              marginRight: "6px",
              fontSize: 13,
              display: "inline-block"
            }}
          >
            {s}
          </span>
        ))
      ) : (
        <span style={{ color: "#999" }}>None</span>
      )}
    </div>
    <div style={{ marginTop: 6, fontSize: 12, color: "#a1a7be" }}>
      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
    </div>
  </div>
);

const DetailedUserModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div
      style={{
        zIndex: 9000,
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        minWidth: "100vw",
        background: "rgba(20,30,50,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="detailed-user-modal-content"
        style={{
          minWidth: 340,
          maxWidth: 430,
          minHeight: 280,
          background: "#fff",
          padding: "34px 34px 24px 34px",
          borderRadius: "13px",
          boxShadow: "0 8px 38px rgba(43,62,131,0.24)",
          zIndex: 9999,
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          style={{
            position: "absolute",
            top: 9,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 22,
            fontWeight: 700,
            color: "#2540a8",
            cursor: "pointer",
            lineHeight: 1,
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Main Content */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <ProfileIcon size={38} />
          <div style={{ marginLeft: 13 }}>
            <div style={{ fontWeight: 600, fontSize: 22, color: "#2540a8" }}>{user.email 
          ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)
          : ""}</div>
            <div style={{
              fontSize: 15,
              color: "#8492ae",
              fontWeight: 500,
              marginTop: 2
            }}>{user.role === 'moderator' ? "Developer" : user.role}</div>
          </div>
        </div>
        <div style={{ marginBottom: 13 }}>
          <b>Email:</b>{" "}
          <span style={{ color: "#2540a8" }}>
            {user.email}
          </span>
        </div>
        <div style={{ marginBottom: 13 }}>
          <b>Skills:</b>{" "}
          {(user.skills && user.skills.length > 0) ? (
            user.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  background: "#daeafd",
                  color: "#2540a8",
                  padding: "3px 11px",
                  borderRadius: "12px",
                  marginRight: "8px",
                  fontSize: 15
                }}
              >
                {skill}
              </span>
            ))
          ) : (
            <span style={{ color: "#888" }}>None</span>
          )}
        </div>
        <div>
          <b>Joined:</b>{" "}
          <span style={{ color: "#5f769e" }}>
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For modal
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("tickets"); // for the buttons on the right

  const ticketDetail = (e, id) => {
    navigate(`/tickets/${id}`, { state: { ticketId: id } });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const token = await localStorage.getItem("token");
    if (!token) {
      alert("Your are not authorized");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      // eslint-disable-next-line
      const data = await res.json();
      setForm({
        title: "",
        description: "",
      });
      // Optionally: await fetchTickets() here for instant update
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    async function checkUser() {
      let user = await localStorage.getItem("user");
      user = await JSON.parse(user);
      setLoggedInUser(user);
      if (!user) {
        navigate("/login");
      }
    }
    checkUser();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        alert("You are Not Authorized");
        navigate("/login");
      }
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/tickets`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("no ticket found", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        alert("You are Not Authorized");
        navigate("/login");
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v1/auth/users`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users, status:", res.status);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Navigation buttons: only visible as per user role
  const renderNavButtons = () => {
    if (!loggedInUser) return null;
    const role = loggedInUser.role;
    return (
      <div className="navbar-buttons">
        {/* Tickets is always visible */}
        <button
          className={`navbar-btn${
            activeNav === "tickets" ? " nav-active" : ""
          }`}
          onClick={() => setActiveNav("tickets")}
        >
          Tickets
        </button>
        {/* Users for admin only */}
        {role === "admin" && (
          <button
            className={`navbar-btn${
              activeNav === "users" ? " nav-active" : ""
            }`}
            onClick={() => {
              setActiveNav("users");
              setSelectedUser(null);
            }}
          >
            Users
          </button>
        )}
      </div>
    );
  };

  // User details popover
  const renderProfilePopover = () => {
    if (!profileOpen || !loggedInUser) return null;
    return (
      <div className="profile-popover-card">
        <div style={{ marginBottom: 8 }}>
          <strong>Profile Details</strong>
        </div>
        <div>
          <b>Name:</b>{loggedInUser.email 
          ? loggedInUser.email.split("@")[0].charAt(0).toUpperCase() + loggedInUser.email.split("@")[0].slice(1)
          : ""}
        </div>
        <div>
          <b>Email:</b> {loggedInUser.email || "N/A"}
        </div>
        <div>
          <b>Role:</b> {loggedInUser.role == "moderator" && "Developer"}
        </div>
      </div>
    );
  };

  return (
    <div className="tickets-root-bestui">
      {/* Navbar */}
      <nav className="navbar-bestui">
        <div className="navbar-left">
          <span className="navbar-brand">HIREDEVS</span>
        </div>
        <div className="navbar-center">{renderNavButtons()}</div>
        <div className="navbar-right">
          {/* Only admin, moderator, user: always show profile button */}
          <div
            className="navbar-profile-wrapper"
            onClick={() => setProfileOpen((v) => !v)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <ProfileIcon />
            {renderProfilePopover()}
          </div>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      {/* Main content */}
      <div className="tickets-content-bestui">
        <div className="tickets-content-inner">
          {/* If Users tab selected (for admin), show user list and user detail card */}
          {loggedInUser?.role === "admin" && activeNav === "users" ? (
            <div>
              <h2 style={{ margin: "20px 0 10px" }}>Users</h2>
              <div className="users-list-bestui">
                {users && users.length ? (
                  users.map((user, idx) => (
                    <UserCard
                      user={user}
                      key={user._id || idx}
                      isSelected={false}
                      onClick={setSelectedUser}
                    />
                  ))
                ) : (
                  <div style={{color: "#888", fontWeight: 500, marginTop: 15}}>No users found.</div>
                )}
              </div>
              {/* User Modal */}
              {selectedUser && (
                <DetailedUserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
              )}
            </div>
          ) : (
            <>
              {/* Show ticket form only to user */}
              {loggedInUser?.role === "user" && (
                <div className="ticket-form-card">
                  <h2>Create New Ticket</h2>
                  <input
                    className="ticket-input-title"
                    type="text"
                    placeholder="Enter ticket title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                  <input
                    className="ticket-input-description"
                    type="text"
                    placeholder="Enter ticket description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  <button className="ticket-submit-button" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              )}

              {/* Tickets card list */}
              <div className="tickets-list-bestui">
                <h2 style={{ margin: "20px 0 10px" }}>Tickets</h2>
                <div className="tickets-cards-grid">
                  {tickets && tickets.length ? (
                    tickets.map((tkt, idx) => (
                      <div
                        className="ticket-item-card-bestui"
                        onClick={(e) => ticketDetail(e, tkt._id)}
                        key={tkt._id || idx}
                      >
                        <div className="ticket-item-header">
                          <span className="ticket-title-bestui">{tkt.title}</span>
                          <span
                            className={`ticket-status-badge status-${tkt.status}`}
                          >
                            {tkt.status}
                          </span>
                        </div>
                        <div className="ticket-desc-bestui">{tkt.description}</div>
                        <div className="ticket-item-footer">
                          <span className="ticket-date-bestui">
                            {tkt.createdAt
                              ? new Date(tkt.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-tickets-message-bestui">
                      No tickets found.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
