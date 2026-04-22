import React, { useContext } from "react";
import { InstructorContext } from "../context/IntructorProvider";
import { Navigate } from "react-router-dom";

const InstructorProtected = ({ children }) => {
  const { instrutor, loading } = useContext(InstructorContext);

  if (loading) {
    return <h1>Loading .....</h1>;
  }

  if (!instrutor) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default InstructorProtected;
