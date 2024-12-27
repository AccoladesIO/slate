import React, { createContext, useContext, useState } from "react";
const AppContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };

    const toggleSideBar = () => {
        setSideBarOpen(!sideBarOpen)
    }
    const contextValue = {
        sideBarOpen,
        toggleSideBar,
        isOpen,
        setIsOpen,
        handleToggle,
    };

    return (
        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>
    );
};


const useContextValue = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useContextValue must be used within a ContextProvider");
    }
    return context;
};

export { ContextProvider, useContextValue };
