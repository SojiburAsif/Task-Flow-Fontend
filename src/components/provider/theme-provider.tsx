"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Exclude<Theme, "system">;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Exclude<Theme, "system"> {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme, disableTransitionOnChange?: boolean, attribute = "class") {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (disableTransitionOnChange) {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode("*,*::before,*::after{transition:none !important;}"));
    document.head.appendChild(style);
    window.getComputedStyle(root);
    requestAnimationFrame(() => {
      style.remove();
    });
  }

  if (attribute === "class") {
    root.classList.remove("dark", "light");
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }

  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  attribute = "class",
  enableSystem = true,
}: Readonly<{
  children: React.ReactNode;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
  attribute?: string;
  enableSystem?: boolean;
}>) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system" ? storedTheme : defaultTheme;
  });
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  React.useEffect(() => {
    applyTheme(theme, disableTransitionOnChange, attribute);
  }, [theme, disableTransitionOnChange, attribute]);

  React.useEffect(() => {
    window.localStorage.setItem("theme", theme);
    applyTheme(theme, disableTransitionOnChange, attribute);

    if (theme !== "system" || !enableSystem) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system", disableTransitionOnChange, attribute);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme, disableTransitionOnChange, attribute, enableSystem]);

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    return {
      theme: "system" as Theme,
      resolvedTheme: "light" as const,
      setTheme: () => undefined,
    };
  }

  return context;
}