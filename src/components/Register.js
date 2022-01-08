import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Link,useHistory } from 'react-router-dom';
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    let url = config.endpoint + "/auth/register";
    setIsLoading(true);
    try {
      if(!validateInput(formData)){
        setIsLoading(false);
        return;
      }
      let body = { username: formData.username, password: formData.password };
      let res = await axios.post(url, body);
      if (res.data.success) {
        enqueueSnackbar("Registration Successfull", { variant: "success" });
        history.push('/login');
      } else {
        enqueueSnackbar("Username is already taken", { variant: "error" });
        throw new Error("Username is already taken")
      }
    } catch (e) {
      if(e.response && e.response.status===400){
        enqueueSnackbar(e.response.data.message,{variant: 'error'});
      }else{
        enqueueSnackbar('Something went wrong. Check with backend',{variant: 'error'})
      }
      setIsLoading(false);
    }
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (formData) => {
    let { username, password, confirmPassword } = formData;
    if(!username){
      enqueueSnackbar('Username is a required field',{variant: 'error'})
      return false;
    }
    if (username.length < 6) {
      enqueueSnackbar('Username must be at least 6 charactors',{variant: 'error'});
      return false;
    }
    if(!password){
      enqueueSnackbar('Username is a required field',{variant: 'error'})
      return false;
    }
    if (password.length < 6) {
      enqueueSnackbar('Username must be at least 6 charactors',{variant: 'error'});
      return false;
    }
    if(password !== confirmPassword){
      enqueueSnackbar('Passwords do not match',{variant: 'error'});
      return false;
    }
    return true;
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} name="register" />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            onChange={handleChange}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            fullWidth
          />
          {isLoading && (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          )}
          {!isLoading && (
            <Button
              onClick={async () => await register(formData)}
              className="button"
              variant="contained"
              name="register"
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
