import "./App.css";

//*import react router dom dependencies for routing the app to different pages and components
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import ProtectedLoggedIn from "./components/auth/ProtectedLoggedIn";

//*import the pages and components to be routed
import Login from "./pages/Login.jsx";
import Summary from "./pages/Summary";
import ComputerInProcess from "./pages/ComputerInProcess";
import ConnectNewwork from "./pages/ConnectNewwork";
import Tablet from "./pages/Tablet";
import RasberyPi from "./pages/RasberyPi";
import JoinDomain from "./pages/JoinDomain";
import Home from "./pages/Home.jsx";

// import Navbar from "../components/Navbar/Navbar";

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedLoggedIn />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* //* Wrap the protected routes in a route component */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/computer_in_process" element={<ComputerInProcess />} />
          <Route path="/connect_newwork" element={<ConnectNewwork />} />
        </Route>
        {/* //* Wrap the protected routes in a route component */}

        {/* //* Wrap the protected routes for Supper Admin in a route component */}
        <Route element={<ProtectedRoutesSupper />}>
          <Route path="/tablet" element={<Tablet />} />
          <Route path="/rasbery_pi" element={<RasberyPi />} />
          <Route path="/join_domain" element={<JoinDomain />} />
        </Route>
        {/* //* Wrap the protected routes for Supper Admin in a route component */}
      </Routes>
    </>
  );
}

export default App;
