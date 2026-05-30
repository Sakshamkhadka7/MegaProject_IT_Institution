import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";


export const UserContext = createContext();
const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

 const getMe = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/student/getMe`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    setUser(data.data);
    setError(false);
  } catch (error) {
    console.log("Error occurred at UserProvider", error);
    setError(true);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(()=>{
    getMe()
  },[])

  return <UserContext.Provider value={{user,loading,error,setUser}}>{children}</UserContext.Provider>;
};
