import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./Components/CheckAuth.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetailsPage from "./pages/TicketDetailsPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Admin from "./pages/Admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protect={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protect={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        />

        <Route
          path="/login"
          element={
            <CheckAuth protect={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path="/signup"
          element={
            <CheckAuth protect={false}>
              <Signup />
            </CheckAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <CheckAuth protect={true}>
              <Admin />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
