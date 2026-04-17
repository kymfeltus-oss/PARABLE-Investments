"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "parable:sidebar-expanded:v1";

type Ctx = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  toggle: () => void;
  sidebarWidthPx: number;
};

const SidebarLayoutContext = createContext<Ctx | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  sidebarWidthOverridePx?: number | null;
};

export function SidebarLayoutProvider({ children, sidebarWidthOverridePx }: ProviderProps) {
  const [expanded, setExpandedState] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "0") setExpandedState(false);
    } catch {
      /* ignore */
    }
  }, []);

  const setExpanded = useCallback((v: boolean) => {
    setExpandedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setExpandedState((e) => {
      const next = !e;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const sidebarWidthPx =
    sidebarWidthOverridePx !== undefined && sidebarWidthOverridePx !== null
      ? sidebarWidthOverridePx
      : expanded
        ? 280
        : 76;

  const value = useMemo(
    () => ({ expanded, setExpanded, toggle, sidebarWidthPx }),
    [expanded, setExpanded, toggle, sidebarWidthPx],
  );

  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>;
}

export function useSidebarLayout() {
  const c = useContext(SidebarLayoutContext);
  if (!c) throw new Error("useSidebarLayout requires provider");
  return c;
}
