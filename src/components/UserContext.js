import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(() => {
      return localStorage.getItem('userEmail') || '';
    });
  
    const setUser = (email) => {
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
    };

    const [selectedFarm, setFarm] = useState(() => {
        return localStorage.getItem('selectedFarm') || '';
    });

    const setSelectedFarm = (farm) => {
        localStorage.setItem('selectedFarm', farm);
        setFarm(farm);
    };

  return (
    <UserContext.Provider value={{ userEmail, setUser, selectedFarm, setSelectedFarm  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};