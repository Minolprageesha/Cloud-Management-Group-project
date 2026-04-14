import { useMemo, useState } from "react";
import CreateOrder from "./components/CreateOrder";
import ChangeStatus from "./components/ChangeStatus";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("create");

  return (
    <div className="app-shell">

      <header className="app-header">
        <div className="app-header-inner">

          {/* Left — Brand */}
          <div className="app-brand">
            <div className="brand-logomark" style={{ marginRight: "8px" }}>
              <svg viewBox="0 0 44 24" fill="none" xmlns="" aria-label="DPD">
                <text x="0" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#ffffff">DPD</text>
              </svg>
            </div>
            <div className="brand-divider" />
            <div className="brand-text">
              <span className="brand-name">DPD Ireland</span>
              <span className="brand-tagline">Operations Admin Portal · Authorised Personnel Only</span>
            </div>
          </div>

          {/* Right — Avatar */}
          <div className="app-header-right">
            <div className="header-avatar">
              <span>OP</span>
            </div>
          </div>

        </div>
      </header>

      <main className="content-card">
        {mode === "create" ? (
          <CreateOrder mode={mode} setMode={setMode} />
        ) : (
          <ChangeStatus mode={mode} setMode={setMode} />
        )}
      </main>

    </div>
  );
}