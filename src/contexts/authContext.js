import { React, createContext, useState } from "react";

const initialState = {
  user: null,
  isAuthenticated: false,
  toggleAuth: () => null,
};

export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
  });

  const toggleAuth = (userData) => {
    setAuth({
      user: userData,
      isAuthenticated: !auth.isAuthenticated,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
