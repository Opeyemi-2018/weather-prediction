// "use client";
// import { useState, useEffect, createContext, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);  

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser);
//         setUser(userData); // Store the parsed user data directly
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export const useAuth = () => useContext(AuthContext);