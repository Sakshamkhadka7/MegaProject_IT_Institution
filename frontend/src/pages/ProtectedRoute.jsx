import React, { lazy, Suspense, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const Loading = lazy(() => import("../components/Loading"));

function ProtectedRoute({ comp }) {
  const { user, loading } = useContext(UserContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Loading />
        </Suspense>
      </div>
    );
  }

  if (!user) return null;

  return comp;
}

export default ProtectedRoute;
