"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function SunIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}

function MoonIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

export default function ThemeToggle({ defaultTheme = "dark" }: { defaultTheme?: Theme }) {
  const storedTheme = useSyncExternalStore(
    () => () => {},
    () => {
      const savedTheme = window.localStorage.getItem("nexus-theme") as Theme | null;
      return savedTheme ?? defaultTheme;
    },
    () => defaultTheme,
  );
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const theme = selectedTheme ?? storedTheme;

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setSelectedTheme(nextTheme);
    window.localStorage.setItem("nexus-theme", nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const nextThemeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button aria-label={nextThemeLabel} aria-pressed={theme === "light"} className="nexus-theme-toggle nexus-focus" onClick={toggleTheme} title={nextThemeLabel} type="button">
      <span className="nexus-theme-toggle__track"><span className="nexus-theme-toggle__thumb">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span></span>
    </button>
  );
}
