import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

function ProtectedRoute({ comp }) {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? comp : null;
}

export default ProtectedRoute;