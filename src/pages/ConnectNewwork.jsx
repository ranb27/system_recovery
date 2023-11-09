import * as React from "react";

//* Components
import Navbar from "../components/Navbar/Navbar";

//* MUI
import Box from "@mui/material/Box";

function ConnectNewwork() {
  //* Responsive Navbar
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle} />
      <div className="container mt-20 ml-12">
        <Box
          marginLeft={isNavbarOpen ? "220px" : 4}
          marginTop={8}
          className={`transition-all duration-500 ease-in-out ${
            isNavbarOpen ? "ml-64" : ""
          }`}
        >
          <h1>Connect Newwork Page</h1>
        </Box>
      </div>
    </>
  );
}

export default ConnectNewwork;
