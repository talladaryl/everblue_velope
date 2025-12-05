import React, { createContext, useContext, useState, useEffect } from "react";

interface BuilderSessionData {
  items: any[];
  bgColor: string;
  bgImage: string | null;
  selectedModelId: string;
  templateId?: number | null;
}

interface BuilderSessionContextType {
  sessionData: BuilderSessionData;
  updateSession: (data: Partial<BuilderSessionData>) => void;
  clearSession: () => void;
  hasUnsavedChanges: boolean;
}

const BuilderSessionContext = createContext<BuilderSessionContextType | undefined>(undefined);

const INITIAL_SESSION: BuilderSessionData = {
  items: [],
  bgColor: "#F3F4F6",
  bgImage: null,
  selectedModelId: "default",
  templateId: null,
};

export const BuilderSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<BuilderSessionData>(() => {
    // Charger depuis sessionStorage si disponible
    const saved = sessionStorage.getItem("builderSession");
    return saved ? JSON.parse(saved) : INITIAL_SESSION;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sauvegarder automatiquement dans sessionStorage
  useEffect(() => {
    sessionStorage.setItem("builderSession", JSON.stringify(sessionData));
    setHasUnsavedChanges(true);
  }, [sessionData]);

  const updateSession = (data: Partial<BuilderSessionData>) => {
    setSessionData((prev) => ({ ...prev, ...data }));
  };

  const clearSession = () => {
    setSessionData(INITIAL_SESSION);
    sessionStorage.removeItem("builderSession");
    setHasUnsavedChanges(false);
  };

  return (
    <BuilderSessionContext.Provider
      value={{
        sessionData,
        updateSession,
        clearSession,
        hasUnsavedChanges,
      }}
    >
      {children}
    </BuilderSessionContext.Provider>
  );
};

export const useBuilderSession = () => {
  const context = useContext(BuilderSessionContext);
  if (!context) {
    throw new Error("useBuilderSession must be used within BuilderSessionProvider");
  }
  return context;
};
