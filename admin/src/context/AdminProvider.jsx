import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();
const API = import.meta.env.VITE_API_URL;
//  const API ="http://localhost:3001";
  


export const AdminProvider = ({ children }) => {
  const [admin,setAdmin ] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 const getAdmin = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/student/getMe`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json(); // ALWAYS parse response

    if (!res.ok) {
      // backend error message handling
      toast.warning(data.message || "Failed to fetch admin data");
      setError(true);
      return;
    }

    console.log(data.data);
    setAdmin(data.data);
    setError(false);

  } catch (error) {
    console.log("Error occured at instructor portal", error);
    toast.warning("Network error or server not responding");
    setError(true);

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
