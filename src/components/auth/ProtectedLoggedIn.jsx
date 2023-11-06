import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
  // Retrieve user_login from localStorage
  const userLogin = localStorage.getItem("userToken");
  // Return true if userLogin exists, false otherwise
  const guestLogin = localStorage.getItem("guestToken");
  return !!userLogin || !!guestLogin;
};

function ProtectedLoggedIn() {
  let isAuth = useAuth();
  return isAuth ? <Navigate to="/home" /> : <Outlet />;
}

export default ProtectedLoggedIn;
