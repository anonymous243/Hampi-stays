import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../utils/apiClient";

interface SystemSettings {
  guideServiceEnabled: boolean;
  maintenanceMode: boolean;
  defaultCommissionRate: number;
}

interface SystemContextType {
  settings: SystemSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await apiClient.get<SystemSettings>("/settings");
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch system settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const data = await apiClient.patch<SystemSettings>("/admin/settings", newSettings);
      setSettings(data);
    } catch (error) {
      console.error("Failed to update system settings:", error);
      throw error;
    }
  };

  return (
    <SystemContext.Provider value={{ settings, isLoading, refreshSettings, updateSettings }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
}
