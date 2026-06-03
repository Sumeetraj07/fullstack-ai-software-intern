"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

export interface SavedComparison {
  id: string;
  collegeIds: string;
  name: string;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  savedColleges: string[];
  savedComparisons: SavedComparison[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  user: UserProfile | null;
  loading: boolean;
  compareIds: string[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  fetchUser: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  toggleSaveCollege: (collegeId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    toastIdRef.current += 1;
    const id = `toast-${toastIdRef.current}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUserState(data.user);
        } else {
          setUserState(null);
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchUser();
      
      // Load compared IDs from localStorage if available
      const savedCompare = localStorage.getItem("compareIds");
      if (savedCompare) {
        try {
          setCompareIds(JSON.parse(savedCompare));
        } catch (e) {
          console.error("Error parsing compareIds from local storage:", e);
        }
      }
    });
  }, [fetchUser]);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
  };

  const addToCompare = (id: string): boolean => {
    if (compareIds.includes(id)) {
      addToast("College already added to comparison", "info");
      return true;
    }
    if (compareIds.length >= 3) {
      addToast("You can compare a maximum of 3 colleges", "error");
      return false;
    }
    const updated = [...compareIds, id];
    setCompareIds(updated);
    localStorage.setItem("compareIds", JSON.stringify(updated));
    addToast("Added to comparison", "success");
    return true;
  };

  const removeFromCompare = (id: string) => {
    const updated = compareIds.filter(cid => cid !== id);
    setCompareIds(updated);
    localStorage.setItem("compareIds", JSON.stringify(updated));
    addToast("Removed from comparison", "info");
  };

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.removeItem("compareIds");
    addToast("Cleared comparison list", "info");
  };

  const toggleSaveCollege = async (collegeId: string): Promise<boolean> => {
    if (!user) {
      addToast("Please login to save colleges", "error");
      return false;
    }

    try {
      const res = await fetch(`/api/user/saved/${collegeId}`, {
        method: "POST"
      });

      if (res.ok) {
        const data = await res.json();
        const isSaved = data.saved;
        
        setUserState(prev => {
          if (!prev) return null;
          const savedColleges = isSaved
            ? [...prev.savedColleges, collegeId]
            : prev.savedColleges.filter(id => id !== collegeId);
          return { ...prev, savedColleges };
        });

        addToast(data.message, "success");
        return true;
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to save college", "error");
        return false;
      }
    } catch (error) {
      console.error("Save college error:", error);
      addToast("An error occurred", "error");
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        compareIds,
        toasts,
        addToast,
        removeToast,
        fetchUser,
        setUser,
        addToCompare,
        removeFromCompare,
        clearCompare,
        toggleSaveCollege
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
