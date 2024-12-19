import React, { createContext, ReactNode, useContext } from "react";
const AppContext = createContext(null);

const ContextProvider = ({ children }) => {
    const contextValue = {
        someValue: "exampleValue",
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
