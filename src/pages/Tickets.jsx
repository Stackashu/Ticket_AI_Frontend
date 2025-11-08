import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tickets.css";

// Simple Profile Icon SVG
const ProfileIcon = ({ size = 32 }) => (
  <svg height={size} viewBox="0 0 24 24" width={size} style={{verticalAlign: 'middle'}}>
    <circle cx="12" cy="8" r="4" fill="#555" />
    <ellipse cx="12" cy="17" rx="7" ry="5" fill="#aaa" />
  </svg>
);

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
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
  }

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
      // Optionally add optimistic update or refetch tickets here.
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
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v1/tickets`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("no ticket found", error);
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
          className={`navbar-btn${activeNav === "tickets" ? " nav-active" : ""}`}
          onClick={() => setActiveNav("tickets")}
        >
          Tickets
        </button>
        {/* Users for admin only */}
        {role === "admin" && (
          <button
            className={`navbar-btn${activeNav === "users" ? " nav-active" : ""}`}
            onClick={() => setActiveNav("users")}
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
        <div style={{ marginBottom: 8 }}><strong>Profile Details</strong></div>
        <div><b>Name:</b> {loggedInUser.name || "N/A"}</div>
        <div><b>Email:</b> {loggedInUser.email || "N/A"}</div>
        <div><b>Role:</b> {loggedInUser.role}</div>
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
        <div className="navbar-center">
          {renderNavButtons()}
        </div>
        <div className="navbar-right">
          {/* Only admin, moderator, user: always show profile button */}
          <div
            className="navbar-profile-wrapper"
            onClick={() => setProfileOpen((v) => !v)}
            style={{cursor:'pointer', position:'relative'}}
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
            <h2 style={{margin: "20px 0 10px"}}>Tickets</h2>
            <div className="tickets-cards-grid">
              {tickets && tickets.length
                ? tickets.map((tkt, idx) => (
                    <div className="ticket-item-card-bestui" onClick={e => ticketDetail(e,tkt._id)} key={tkt._id || idx}>
                      <div className="ticket-item-header">
                        <span className="ticket-title-bestui">{tkt.title}</span>
                        <span className={`ticket-status-badge status-${tkt.status}`}>
                          {tkt.status}
                        </span>
                      </div>
                      <div className="ticket-desc-bestui">{tkt.description}</div>
                      <div className="ticket-item-footer">
                        <span className="ticket-date-bestui">
                          {tkt.createdAt ? new Date(tkt.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </div>
                  ))
                : (
                  <div className="no-tickets-message-bestui">
                    No tickets found.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Tickets;
