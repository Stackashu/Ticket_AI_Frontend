import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketDetailsPage.css"

const TicketDetailsPage = () => {
  const [ticketDetail, setTicketDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParts = window.location.pathname.split("/");
    const ticketId = urlParts[urlParts.length - 1];
    fetchTicket(ticketId);
    // eslint-disable-next-line
  }, []);

  const fetchTicket = async (id) => {
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        alert("You are Not Authorized");
        window.location.href = "/login";
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v1/tickets/${id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data.ticket)
      setTicketDetail(data.ticket || null);
    } catch (error) {
      console.error("no ticket found", error);
    }
  };

 

  if (!ticketDetail) {
    return (
      <div className="ticket-details-page-root">
        <div className="ticket-details-loading">Loading ticket details...</div>
      </div>
    );
  }

  return (
    <div className="ticket-details-page-root">
      <button
        style={{
          marginBottom: "18px",
          background: "#f3f6ff",
          color: "#2540a8",
          border: "1px solid #b0c6fd",
          borderRadius: "5px",
          padding: "7px 19px",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: "1rem",
          boxShadow: "0 1px 3px rgba(180,195,255,0.14)"
        }}
        onClick={() => navigate("/")}
      >
        ← Back to Tickets
      </button>
      <div className="ticket-details-card">
        <div className="ticket-details-header">
          <h2 className="ticket-details-title">{ticketDetail.title || "Untitled Ticket"}</h2>
          <span className={`ticket-details-status status-${(ticketDetail.status || "").toLowerCase()}`}>
            {ticketDetail.status}
          </span>
        </div>
        <div className="ticket-details-section">
          <label className="ticket-details-label">ID:</label>
          <span className="ticket-details-value">{ticketDetail._id}</span>
        </div>
        <div className="ticket-details-section">
          <label className="ticket-details-label">Created By:</label>
          <span className="ticket-details-value">{ticketDetail.createdBy?.email}</span>
        </div>
        <div className="ticket-details-section">
          <label className="ticket-details-label">Assigned To:</label>
          <span className="ticket-details-value">{ticketDetail.assignedTo?.email || "Unassigned"}</span>
        </div>
        {/* <div className="ticket-details-section">
          <label className="ticket-details-label">Email:</label>
          <span className="ticket-details-value">{ticketDetail.email || "N/A"}</span>
        </div> */}
        <div className="ticket-details-section">
          <label className="ticket-details-label">Priority:</label>
          <span className={`ticket-details-priority priority-${(ticketDetail.priority || "").toLowerCase()}`}>
            {ticketDetail.priority}
          </span>
        </div>
        <div className="ticket-details-section">
          <label className="ticket-details-label">Created At:</label>
          <span className="ticket-details-value">
            {ticketDetail.createdAt ? new Date(ticketDetail.createdAt).toLocaleString() : "N/A"}
          </span>
        </div>
        <div className="ticket-details-section">
          <label className="ticket-details-label">Description:</label>
          <div className="ticket-details-description">{ticketDetail.description}</div>
        </div>
        {ticketDetail.relatedSkills && ticketDetail.relatedSkills.length > 0 && (
          <div className="ticket-details-section">
            <label className="ticket-details-label">Related Skills:</label>
            <div className="ticket-details-skills-list">
              {ticketDetail.relatedSkills.map((skill, idx) => (
                <span key={idx} className="ticket-skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {ticketDetail.helpfulNotes && (
          <div className="ticket-details-section">
            <label className="ticket-details-label">Helpful Notes:</label>
            <div className="ticket-details-helpful-notes">{ticketDetail.helpfulNotes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;
