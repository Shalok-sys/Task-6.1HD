import React, { createContext, useState } from 'react';
import app from './firebase';
import { getAuth, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUSP, setUSP] = useState(false);

  const ForceSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Force Sign Out...executed")
    } catch (error) {
      console.log(error);
    }
  };
  const USPin = () => setUSP(true);
  const USPout = () => setUSP(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    ForceSignOut();
    USPout();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, USPin, USPout, isUSP }}>
      {children}
    </AuthContext.Provider>
  );
};
