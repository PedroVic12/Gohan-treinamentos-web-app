import React, { createContext, useContext, ReactNode, useState } from 'react';

interface SessionContextType {
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    return (
        <SessionContext.Provider value={{ drawerOpen, setDrawerOpen }}>
            {children}
        </SessionContext.Provider>
    );
};
