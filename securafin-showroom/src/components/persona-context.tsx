"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type VisitorPersona = "corporate" | "smb";

type PersonaContextValue = {
  persona: VisitorPersona;
  setPersona: (p: VisitorPersona) => void;
};

const STORAGE_KEY = "securafin-persona";

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function SecurafinPersonaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [persona, setPersonaState] = useState<VisitorPersona>("smb");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "corporate" || raw === "smb") setPersonaState(raw);
    } catch {
      /* ignore */
    }
  }, []);

  const setPersona = useCallback((p: VisitorPersona) => {
    setPersonaState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ persona, setPersona }),
    [persona, setPersona],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function useSecurafinPersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error("useSecurafinPersona must be used within SecurafinPersonaProvider");
  }
  return ctx;
}
