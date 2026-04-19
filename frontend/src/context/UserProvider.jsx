import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
        setLoading(true)
      let res = await fetch("http://localhost:3001/api/v1/student/getMe", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
       
        setUser(res.data);
        setError(false);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error oocured at UserProvider", error);
      setError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getMe()
  },[])

  return <UserContext.Provider value={{user,loading,error,setUser}}>{children}</UserContext.Provider>;
};
