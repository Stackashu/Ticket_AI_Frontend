import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tickets.css"

const Tickets = () => {
  const [tickets, setTickets] = useState([{}]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const handleChange = (e)=>{
    const name = e.target.name 
    const value = e.target.value

    setForm({...form , [name]: value})
  }

  const handleSubmit =  async ()=>{
    
    const token = await localStorage.getItem("token")
    if(!token){
      alert("Your are not authorized")
      navigate("/login")
    }
     try {
       const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/tickets`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
         body: JSON.stringify(form)
       });
       const data = res.json()
       console.log("data",data)
     } catch (error) {
      console.error("error",error)
     }
  } 

  useEffect(() => {
    async function checkUser() {
      const user = await localStorage.getItem("user");
      if (!user) {
        navigate("/login");
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = await localStorage.getItem("token");
        // console.log("token", token)
        if (!token) {
          alert("You are Not Authorized");
          navigate("/login");
        }
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/tickets`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }
        );
        const data = await res.json();
        setTickets(data.tickets); // Save to state (missing from original)
        // console.log(data);
      } catch (error) {
        console.error("no ticket found", error);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div className="tickets-container">
      <div className="ticket-form-outer">
        <div className="ticket-form-inner">
          <input
            className="ticket-input-title"
            type="text"
            placeholder="Enter ticket title"
            name="title"
            value={form.title}
            onChange={e => handleChange(e)}
            />
          <input
            className="ticket-input-description"
            type="text"
            placeholder="Enter ticket description"
            name="description"
            value={form.description}
            onChange={e => handleChange(e)}
          />
          <button className="ticket-submit-button" onClick={handleSubmit}>submit</button>
        </div>
      </div>
      <div className="tickets-list">
        {tickets.map((tkt, idx) => {
          return (
            <div className="ticket-item" key={idx}>
              <h1 className="ticket-title">{tkt.title}</h1>
              <p className="ticket-description">{tkt.description}</p>
              <h1 className="ticket-status">{tkt.status}</h1>
              <h1 className="ticket-date">{tkt.createdAt}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tickets;
