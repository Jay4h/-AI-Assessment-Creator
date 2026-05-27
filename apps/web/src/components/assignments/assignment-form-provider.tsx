"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import {
  createAssignmentStore,
  type AssignmentStore,
  type AssignmentStoreApi,
} from "@/lib/stores/assignment-store";

const AssignmentStoreContext = createContext<AssignmentStoreApi | null>(null);

export function AssignmentFormProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AssignmentStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createAssignmentStore();
  }
  return (
    <AssignmentStoreContext.Provider value={storeRef.current}>
      {children}
    </AssignmentStoreContext.Provider>
  );
}

export function useAssignmentStore<T>(selector: (s: AssignmentStore) => T): T {
  const store = useContext(AssignmentStoreContext);
  if (!store) {
    throw new Error("useAssignmentStore must be used within AssignmentFormProvider");
  }
  return useStore(store, selector);
}
