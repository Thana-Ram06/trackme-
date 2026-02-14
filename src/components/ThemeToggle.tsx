"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="theme-toggle"
      onClick={handleClick}
    >
      <div className="theme-toggle-thumb" />
      <div className="theme-toggle-icons">
        <span className="theme-toggle-icon theme-toggle-icon--sun">☼</span>
        <span className="theme-toggle-icon theme-toggle-icon--moon">☾</span>
      </div>
    </button>
  );
}

