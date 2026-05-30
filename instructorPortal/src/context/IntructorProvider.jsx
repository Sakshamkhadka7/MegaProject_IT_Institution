import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const InstructorContext = createContext();

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


export const IntructorProvider = ({ children }) => {
  const [instrutor, setInstructor] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

const getInstructor = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/student/getMe`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json()

    if (res.ok) {
      setInstructor(data?.data);
      setError(false);
    } else {
      setError(true);
      toast.error(data?.message || "Failed to fetch instructor data");
    }
  } catch (error) {
    console.log("Error occurred at instructor portal", error);
    setError(true);
    toast.error("Network error while fetching instructor data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getInstructor();
  }, []);

  return (
    <InstructorContext.Provider
      value={{ instrutor, setInstructor, loading, error }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
