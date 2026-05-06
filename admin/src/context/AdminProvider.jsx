import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();
const API = import.meta.env.VITE_API_URL;


export const AdminProvider = ({ children }) => {
  const [admin,setAdmin ] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getAdmin = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${API}/api/v1/student/getMe`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
        console.log(res.data);
        setAdmin(res.data);
         setError(false);
        setLoading(false);
      }
    } catch (error) {
        console.log("Error occured at instructor portal", error);
      setError(true);
      setLoading(false);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <AdminContext.Provider
      value={{ admin, setAdmin,loading, error  }}
    >
      {children}
    </AdminContext.Provider>
  );
};
