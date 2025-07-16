import { useEffect, useState } from "react";

// Reads stored preference or falls back to system
const getPreferredTheme = () => {
  const stored = localStorage.getItem("theme");

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Default: system preference
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return systemPrefersDark ? "dark" : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme);
  const [manualOverride, setManualOverride] = useState(
    ["light", "dark"].includes(localStorage.getItem("theme"))
  );

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (value) => {
      if (value === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Apply current theme
    applyTheme(theme);

    if (manualOverride) {
      // Save user override to localStorage
      localStorage.setItem("theme", theme);
    } else {
      // Follow system and update if it changes
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const updateSystemTheme = (e) => {
        const systemTheme = e.matches ? "dark" : "light";
        setTheme(systemTheme);
      };
      media.addEventListener("change", updateSystemTheme);
      return () => media.removeEventListener("change", updateSystemTheme);
    }
  }, [theme, manualOverride]);

  // This setter enables override on first toggle
  const setThemeWithOverride = (value) => {
    setManualOverride(true);
    setTheme(value);
  };

  return [
    theme === "dark",
    (checked) => setThemeWithOverride(checked ? "dark" : "light"),
  ];
}
