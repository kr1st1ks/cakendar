// File: contexts/SettingsContext.tsx
import React, { createContext, useContext, useState } from 'react';

type SettingsContextType = {
    showWeekNumbers: boolean;
    setShowWeekNumbers: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showWeekNumbers, setShowWeekNumbers] = useState<boolean>(false);
    return (
        <SettingsContext.Provider value={{ showWeekNumbers, setShowWeekNumbers }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};