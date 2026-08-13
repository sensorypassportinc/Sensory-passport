"use client";

import { ChangeEvent, useState } from "react";

const STORAGE_KEY = "sensory-passport";

export default function PassportBackupControls() {
  const [message, setMessage] = useState("");

  function exportPassport() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setMessage("Save a passport first, then export it.");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const backup = {
        format: "sensory-passport-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        data: parsed,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = String(parsed?.passport?.name || parsed?.name || "passport")
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "") || "passport";
      link.href = url;
      link.download = `${safeName}-sensory-passport-backup.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded. Keep the file somewhere private and safe.");
    } catch {
      setMessage("We could not create a backup from the saved passport.");
    }
  }

  function importPassport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const data = parsed?.format === "sensory-passport-backup" ? parsed.data : parsed;
        if (!data || typeof data !== "object") throw new Error("Invalid backup");
        const passport = data.passport ?? data;
        if (!passport || typeof passport !== "object" || typeof passport.name !== "string") {
          throw new Error("Invalid passport");
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setMessage("Passport restored. Reloading…");
        window.setTimeout(() => window.location.reload(), 350);
      } catch {
        setMessage("That file does not look like a valid Sensory Passport backup.");
      }
    };
    reader.onerror = () => setMessage("We could not read that backup file.");
    reader.readAsText(file);
  }

  return (
    <details style={{ position: "fixed", left: 14, bottom: 14, zIndex: 30, maxWidth: 340 }}>
      <summary style={{ cursor: "pointer", listStyle: "none", background: "#173c42", color: "white", padding: "11px 16px", borderRadius: 999, fontWeight: 800, boxShadow: "0 6px 18px #173c4230" }}>
        Backup & transfer
      </summary>
      <div style={{ marginTop: 8, background: "#fffefa", border: "1px solid #c9d8d4", borderRadius: 16, padding: 16, boxShadow: "0 12px 32px #173c4224" }}>
        <strong style={{ display: "block", marginBottom: 6 }}>Keep your passport safe</strong>
        <p style={{ margin: "0 0 12px", color: "#607b7e", fontSize: 13, lineHeight: 1.5 }}>
          Export a private backup before changing phones or browsers. Importing replaces the passport saved on this device.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={exportPassport} style={{ border: 0, borderRadius: 999, padding: "10px 13px", background: "#177f78", color: "white", fontWeight: 800, cursor: "pointer" }}>
            Export passport
          </button>
          <label style={{ border: "1px solid #b9d1cb", borderRadius: 999, padding: "10px 13px", color: "#173c42", fontWeight: 800, cursor: "pointer" }}>
            Import passport
            <input type="file" accept="application/json,.json" onChange={importPassport} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
          </label>
        </div>
        {message && <p role="status" style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.45, color: "#49666a" }}>{message}</p>}
      </div>
    </details>
  );
}
