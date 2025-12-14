import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';

// Define the shape of the context state
interface AppContextType {
  appName: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create the context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provides application-wide state (e.g., UI preferences, non-auth settings).
 * @param children - The components to wrap with the provider.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const contextValue = useMemo(() => ({
    appName: "Africoin Rail",
    isSidebarOpen,
    toggleSidebar,
  }), [isSidebarOpen]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to use the application context.
 * @returns The application context state and functions.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

