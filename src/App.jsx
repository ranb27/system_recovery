import "./App.css";

//*import react router dom dependencies for routing the app to different pages and components
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";

//*import the pages and components to be routed
import Login from "./pages/Login.jsx";
import ComputerInProcess from "./pages/ComputerInProcess";
import ConnectNetwork from "./pages/ConnectNetwork";
import Tablet from "./pages/Tablet";
import RasberyPConnectNetwork from "./pages/RasberyPi";
import JoinDomain from "./pages/JoinDomain";
import Navbar from "./components/Navbar/Navbar";
import RasberyPi from "./pages/RasberyPi";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/computer_in_process" element={<ComputerInProcess />} />

        {/* //* Wrap the protected routes in a route component */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Navbar />} />
          <Route path="/connect_network" element={<ConnectNetwork />} />
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
