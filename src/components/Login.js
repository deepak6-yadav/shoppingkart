import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showAuthButtons, setShowAuthButtons] = useState(true);
  const [loading, setLoading] = useState(false);
  // useEffect(()=>{
  //   let data = JSON.parse(localStorage.getItem("userData"));
  //   if(data!==null){
  //     history.push('/products',{from: 'Login'});
  //   }
  // },[])
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const handleChange = (e) => {
    setLoginData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const login = async (loginData) => {
    let endpoint = config.endpoint + "/auth/login";
    setLoading(true);
    try {
      if (validateInput(loginData)) {
        let res = await axios.post(endpoint, loginData);
        if (res.data.success) {
          enqueueSnackbar("logged in", { variant: "success" });
          persistLogin(res.data.token, res.data.username, res.data.balance);
          history.push("/");
        } else {
          enqueueSnackbar(res.data.message, { variant: "error" });
          throw new Error(res.data.message);
        }
      } else {
        throw new Error("Username/password is required");
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check with backend", {
          variant: "error",
        });
      }
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (
      data.username.trim().length === 0 ||
      data.password.trim().length === 0
    ) {
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} name="login" />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            varient="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            label="Password"
            varient="outlined"
            title="Password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            fullWidth
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => login(loginData)}
          >
            {loading && <CircularProgress color="success" />}
            {!loading && <span>LOGIN TO QKART</span>}
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" name="register link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
