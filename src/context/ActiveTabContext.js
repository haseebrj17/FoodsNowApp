import React, { useState, createContext } from 'react';

const ActiveTabContext = createContext();

export const ActiveTabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("Home"); // Default active tab

    return (
        <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </ActiveTabContext.Provider>
    );
};

export default ActiveTabContext;
