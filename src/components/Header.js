import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
  const history = useHistory();
  const [hideButtons, setHideButtons] = useState(props.hasHiddenAuthButtons);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    let data = localStorage.getItem("username");
    if (data !== null) {
      setIsAuthenticated(true);
      setUserData(data);
    } else {
      setIsAuthenticated(false);
    }
    
  }, []);

  const goToLogin = (path) => {
    history.push(path);
  };

  const onLogout = (e) => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    setHideButtons(true);
    history.push("/");
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        {/* FIXME - Skip svg in stub generator */}
        <img src="logo_light.svg" alt="QKart-icon" />
      </Box>
      {props.children}
      <Box>
        {hideButtons && (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => goToLogin("/")}
          >
            Back to explore
          </Button>
        )}
        {!hideButtons && !isAuthenticated && (
          <Button onClick={() => goToLogin("/login")}>LOGIN</Button>
        )}
        {!hideButtons && !isAuthenticated && (
          <Button onClick={() => goToLogin("/register")} variant="contained">
            REGISTER
          </Button>
        )}
        {isAuthenticated && (
          <Fragment>
            <Button>
              <Avatar>
                <img src="avatar.png" alt={userData} />
              </Avatar>
              {userData}
            </Button>
            <Button onClick={onLogout}>LOGOUT</Button>
          </Fragment>
        )}
      </Box>
    </Box>
  );
};

export default Header;
