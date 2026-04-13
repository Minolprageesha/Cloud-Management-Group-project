import { useMemo, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import ChangeStatus from "./components/ChangeStatus";
import "./App.css";

const dashboardHighlights = [
  {
    label: "Cloud-ready workflow",
    text: "Manage invoice creation and delivery updates from one operations surface."
  },
  {
    label: "Employee portal",
    text: "Give internal teams a clear and simple way to submit and update parcel records."
  },
  {
    label: "Assignment focus",
    text: "Frontend improvements support the cloud modernization story with a cleaner UX."
  }
];

export default function App() {
  const [mode, setMode] = useState("create");

  const modeCopy = useMemo(
    () =>
      mode === "create"
        ? {
            kicker: "Order Intake",
            title: "Create customer invoice requests quickly",
            description:
              "Capture order, customer, and billing details in a cleaner employee workflow before they move through the parcel lifecycle."
          }
        : {
            kicker: "Operations Control",
            title: "Track and update delivery progress",
            description:
              "Review existing records, monitor status distribution, and update invoice progress without leaving the dashboard."
          },
    [mode]
  );

  return (
    <div className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy-block">
          <p className="eyebrow">DPD Ireland Internal Operations Portal</p>
          <h1>Parcel Notification and Invoice Dashboard</h1>
          <p className="hero-copy">
            A cleaner internal dashboard for creating invoice-linked orders and managing parcel
            status updates as part of the team&apos;s cloud management assignment.
          </p>

          <div className="mode-banner">
            <span className="section-kicker">{modeCopy.kicker}</span>
            <h2>{modeCopy.title}</h2>
            <p>{modeCopy.description}</p>
          </div>
        </div>

        <aside className="hero-side-panel">
          {dashboardHighlights.map((item) => (
            <article key={item.label} className="highlight-card">
              <span className="highlight-label">{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </aside>
      </section>

      <section className="toolbar-panel">
        <div className="toggle-buttons">
          <button
            type="button"
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Create New Order
          </button>

          <button
            type="button"
            className={mode === "update" ? "active" : ""}
            onClick={() => setMode("update")}
          >
            Change Order Status
          </button>
        </div>

        <p className="toolbar-note">
          Switch between intake and status management to demonstrate both customer record creation
          and operational follow-up.
        </p>
      </section>

      <main className="content-card">
        {mode === "create" ? <CreateOrder /> : <ChangeStatus />}
      </main>
    </div>
  );
}
