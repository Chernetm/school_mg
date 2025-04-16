// context/UserContext.js
"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext({ user: null }); // ✅ Default fallback

export const UserProvider = ({ children, initialUser }) => {
  const [user] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
