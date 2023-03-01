import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseContex from "../../context/FirebaseContext";
import { auth } from "../../config/FirebaseConfig";
import Box from "@mui/material/Box";
import { AppBar, IconButton, Toolbar, Tooltip, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";

import DarkMode from "../darkmode/DarkMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomSnackbar from "../snackbar/snackbar";

const Navbar = () => {

   //new const for snackbar
   const [message, setMessage] = useState(false);
   const [showSnackbar, setShowSnackbar] = useState(false);
   const handleSnackbarClose = () => {
     setShowSnackbar(false);
   };


  const { logout, isSearch, setIsSearch } = useContext(firebaseContex);

  const navigate = useNavigate();

  const handleLogout = async () => {
    // setMessage("Come back. You are out on space.");
    setShowSnackbar(true);
    navigate("/login");
    await logout();

  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  return (
    <AppBar position="static" className="appbar" sx={{ borderColor: "#000", backgroundColor: "var(--card_color)", color: "var(--text_color)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <IconButton
                  onClick={() => setIsSearch(!isSearch)}
                  size="large"
                  color="inherit"
                >
                  <SearchIcon />
                </IconButton>

                <IconButton
                  size="large"
                  color="inherit"
                  component={Link}
                  to={`/profile/${auth.currentUser?.displayName}`}
                >
                  <PersonIcon />
                </IconButton>

              </MenuItem>
            </Menu>
          </Box>

          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* <a href ="/"><img src = "/images/logo/logo-light.png" ></img></a> */}
            <div className="logo-image" 
            
            style={{ 
            width: "200px", 
            height: "40px", 
            backgroundImage: "var(--logo_color)",
            backgroundSize:"cover",
            backgroundRepeat: "no-repeat"}}></div>
            
          </Typography>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* <a href ="/"><img src = "/images/logo/logo-light.png" ></img></a> */}
            <a href ="/"><img src = "/images/logo/rocket-3d-logo.png"
            style = {{height: "50px", width: "auto", marginTop: "5px" }} ></img></a>
            
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Tooltip title="Search">
              <IconButton
                onClick={() => setIsSearch(!isSearch)}
                size="large"
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Go to Profile">
              <IconButton
                size="large"
                color="inherit"
                component={Link}
                to={`/profile/${auth.currentUser?.displayName}`}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* new */}
          <Box
            sx={{
              flexGrow: 0,
              backgroundColor: "var(--card_color)",
              color: "var(--text_color)",
            }}
          >
            <Tooltip title="Menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MoreVertIcon style={{ color: "var(--body_color)" }} />
              </IconButton>
            </Tooltip>
            <Menu
              onClick={handleCloseUserMenu}
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                style: {
                  backgroundColor: "var(--home_background)", boxShadow: "var(--box_shadow)"
                }

              }}
            >
              <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutIcon />}
                sx={{ marginBottom: "5px", color: "#57636F", borderColor: "#57636F", border: "none",'&:hover': { borderColor: '#57636F', backgroundColor: "var(--button)", color: "var(--text_color)",border: "none" } }}>
                Logout
              </Button>
              <CustomSnackbar
                open={showSnackbar}
                message="Come back. You are out on space."
                variant="success"
                onClose={handleSnackbarClose}
              />
              <DarkMode />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
