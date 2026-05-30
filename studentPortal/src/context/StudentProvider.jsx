import { createContext, useEffect, useState } from "react";

export const StudentContext = createContext();
const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";



export const StudentProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getMe = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${API}/api/v1/student/getMe`, {
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

  useEffect(() => {
    getMe();
  }, []);

  return (
    <StudentContext.Provider value={{ user,setUser,loading, error }}>
      {children}
    </StudentContext.Provider>
  );
};
