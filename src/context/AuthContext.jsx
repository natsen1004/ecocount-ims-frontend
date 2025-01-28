import { createContext, useState, useEffect } from "react";
import socket from "../utilities/socket";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ email: "user@example.com" }); 
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("join", user.email);

      socket.on("emailNotification", (message) => {
        alert(message); 
      });

      return () => {
        socket.off("emailNotification");
      };
    }
  }, [user]); 

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}


