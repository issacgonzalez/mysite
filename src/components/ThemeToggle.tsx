// src/components/ThemeToggle.tsx
import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setDark(!dark)}
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "0.6rem 1rem",
        borderRadius: "9999px",
        border: "1px solid gray",
        background: dark ? "#111" : "#fff",
        color: dark ? "#fff" : "#111",
        cursor: "pointer",
      }}
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
