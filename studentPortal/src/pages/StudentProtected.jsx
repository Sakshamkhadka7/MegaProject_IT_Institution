import { lazy, useContext } from "react";
import { StudentContext } from "../context/StudentProvider";
import { Navigate } from "react-router-dom";

const Loading=lazy(()=> import("../components/Loading"));

function StudentProtected({ children }) {
  const { user, loading } = useContext(StudentContext);

  if (loading) {
    return <h1><Loading/></h1>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default StudentProtected;
