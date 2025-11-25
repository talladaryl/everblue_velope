import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import React from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test Component for Theme
const ThemeTestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-display">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

// Test Component for Language
const LanguageTestComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <div data-testid="language-display">{language}</div>
      <div data-testid="translation">{t("menu.theme")}</div>
      <button
        onClick={() => setLanguage("en")}
        data-testid="set-en"
      >
        English
      </button>
      <button
        onClick={() => setLanguage("fr")}
        data-testid="set-fr"
      >
        Français
      </button>
    </div>
  );
};

describe("Theme Context", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should toggle theme", () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    const themeDisplay = screen.getByTestId("theme-display");
    const toggleButton = screen.getByTestId("toggle-theme");

    expect(themeDisplay.textContent).toBe("light");

    fireEvent.click(toggleButton);

    expect(themeDisplay.textContent).toBe("dark");
  });

  test("should persist theme to localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme");
    fireEvent.click(toggleButton);

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("should restore theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    const themeDisplay = screen.getByTestId("theme-display");
    expect(themeDisplay.textContent).toBe("dark");
  });

  test("should apply dark class to html element", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("Language Context", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should change language", () => {
    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    const languageDisplay = screen.getByTestId("language-display");
    const setEnButton = screen.getByTestId("set-en");

    expect(languageDisplay.textContent).toBe("fr");

    fireEvent.click(setEnButton);

    expect(languageDisplay.textContent).toBe("en");
  });

  test("should persist language to localStorage", () => {
    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    const setEnButton = screen.getByTestId("set-en");
    fireEvent.click(setEnButton);

    expect(localStorage.getItem("language")).toBe("en");
  });

  test("should restore language from localStorage", () => {
    localStorage.setItem("language", "it");

    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    const languageDisplay = screen.getByTestId("language-display");
    expect(languageDisplay.textContent).toBe("it");
  });

  test("should translate text correctly", () => {
    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    const translation = screen.getByTestId("translation");
    expect(translation.textContent).toBe("Thème");
  });

  test("should update translation when language changes", async () => {
    render(
      <LanguageProvider>
        <LanguageTestComponent />
      </LanguageProvider>
    );

    const translation = screen.getByTestId("translation");
    const setEnButton = screen.getByTestId("set-en");

    expect(translation.textContent).toBe("Thème");

    fireEvent.click(setEnButton);

    await waitFor(() => {
      expect(translation.textContent).toBe("Theme");
    });
  });
});

describe("Theme and Language Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should work together without conflicts", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      const { language } = useLanguage();

      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <div data-testid="language">{language}</div>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("language").textContent).toBe("fr");
  });

  test("should persist both theme and language", () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      const { setLanguage } = useLanguage();

      return (
        <div>
          <button onClick={() => toggleTheme()} data-testid="toggle">
            Toggle
          </button>
          <button onClick={() => setLanguage("en")} data-testid="change-lang">
            Change
          </button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("toggle"));
    fireEvent.click(screen.getByTestId("change-lang"));

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(localStorage.getItem("language")).toBe("en");
  });
});
