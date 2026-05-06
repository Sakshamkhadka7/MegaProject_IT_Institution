import React, { createContext, useEffect, useState } from "react";

export const InstructorContext = createContext();

const API = import.meta.env.VITE_API_URL;


export const IntructorProvider = ({ children }) => {
  const [instrutor, setInstructor] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getInstructor = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${API}/api/v1/student/getMe`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        res = await res.json();
        console.log(res.data);
        setInstructor(res.data);
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
    getInstructor();
  }, []);

  return (
    <InstructorContext.Provider
      value={{ instrutor, setInstructor,loading, error  }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
