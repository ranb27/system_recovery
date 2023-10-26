//* Login page component *//

import "./styles/Login.css";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Fuji from "/Fuji.png";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  //*State for user login and password*//
  const [password, setPassword] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const system_no = 2;

  //*Navigate to home page*//
  const navigate = useNavigate();

  //*Database for user login and password*//
  const userDatabase = `http://10.17.66.242:3001/api/smart_planning/filter-user-login-smart-recovery?user_login=${userLogin}&system_no=${system_no}`;

  //*Check user login and password in database*//
  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .get(userDatabase)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (
          data[0].user_login === userLogin &&
          data[0].user_password === password &&
          data[0].system_no === 2
        ) {
          localStorage.setItem("userToken", JSON.stringify(data[0]));
          console.log("Logged in successfully");
          Swal.fire({
            icon: "success",
            title: "Login Success",
            text: "Welcome to Smart Planning",
          });
          navigate("/home");
        } else {
          console.log("Login failed");
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Please check your email or password",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error.message);
        Swal.fire({
          icon: "error",
          title: "User does not exist",
          text: "Please check your email or password",
        });
      });
  };

  const handleGuest = () => {
    localStorage.setItem(
      "guestToken",
      JSON.stringify({
        user_login: "Guest",
        role_type: "Guest",
        system_no: 2,
        role_no: 4,
      })
    );
    Swal.fire({
      icon: "warning",
      title: "Guest Mode",
      text: "Guest mode for read only",
    });
  };

  return (
    <>
      <div className="login-container">
        <p className="login-title">System Recovery</p>
        <img
          src={Fuji}
          alt="fuji"
          className="login-logo"
          style={{
            width: 90,
            margin: 10,
          }}
        />
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="standard"
            margin="normal"
            value={userLogin}
            onChange={(event) => setUserLogin(event.target.value)}
          />
          <br />
          <TextField
            label="Password"
            variant="standard"
            margin="normal"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ m: 4 }}
          >
            Login <LockOpenOutlinedIcon sx={{ ml: 1 }} />
          </Button>
          <br />
          <Link to="/home" onClick={handleGuest}>
            Go to dashboard with guest
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
