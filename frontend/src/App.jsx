import { useState } from "react";
import CreateOrder from "./components/CreateOrder";
import ChangeStatus from "./components/ChangeStatus";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("create");

  return (
    <div className="container">
      <header className="header">
        <h1>DPD Ireland – Parcel Notification Portal</h1>
        <p>Internal tool for employees to manage parcel updates</p>
      </header>

      <div className="toggle-buttons">
        <button
          className={mode === "create" ? "active" : ""}
          onClick={() => setMode("create")}
        >
          Create New Order
        </button>

        <button
          className={mode === "update" ? "active" : ""}
          onClick={() => setMode("update")}
        >
          Change Order Status
        </button>
      </div>

      <main className="card">
        {mode === "create" ? <CreateOrder /> : <ChangeStatus />}
      </main>
    </div>
  );
}
