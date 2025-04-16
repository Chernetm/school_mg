// context/RoleContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children, initialRole }) => {
  const [role] = useState(initialRole); // Set once from server

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
