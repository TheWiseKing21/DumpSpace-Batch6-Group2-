import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseContex from "../../context/FirebaseContext";
import { db, auth } from "../../config/FirebaseConfig";
import Box from "@mui/material/Box";
import { AppBar, IconButton, Toolbar, Tooltip, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import DarkMode from "../darkmode/DarkMode";
import CustomSnackbar from "../snackbar/snackbar";

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
} from "firebase/firestore";

const Navbar = () => {
  const [message, setMessage] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const { logout, isSearch, setIsSearch } = useContext(firebaseContex);

  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/login");
    setMessage("Come back. You are out on space.");
    setShowSnackbar(true);
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

  const [currentUserPic, setCurrentUserPic] = useState([]);
  const getUserPic = () => {
    const postRef = collection(db, "profile");
    const q = query(
      postRef,
      where("username", "==", auth.currentUser.displayName),
      orderBy("datePostedOn", "desc"),
      limit(1)
    );

    onSnapshot(q, (querySnapshot) => {
      setCurrentUserPic(querySnapshot.docs);
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      getUserPic();
    }
  });

  return (
    <AppBar
      position="static"
      className="appbar"
      sx={{
        borderColor: "#000",
        backgroundColor: "var(--card_color)",
        color: "var(--text_color)",
      }}
    >
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
            <div
              className="logo-image"
              style={{
                width: "200px",
                height: "40px",
                backgroundImage: "var(--logo_color)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
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
            <a href="/">
              <img
                src="/images/logo/rocket-3d-logo.png"
                style={{ height: "50px", width: "auto", marginTop: "5px" }}
              ></img>
            </a>
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
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              backgroundColor: "var(--card_color)",
              color: "var(--text_color)",
              display: "flex",
              paddingBottom: "5px",
            }}
          >
            <Typography sx={{ marginTop: "8px", fontWeight: 400 }}>
              OuterSpace mode
            </Typography>
            <DarkMode />
            <Typography
              sx={{ marginTop: "8px", fontWeight: 600, marginLeft: "10px" }}
            >
              {auth.currentUser?.displayName}
            </Typography>
            <Tooltip title="Menu">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "10px" }}
              >
                <div>
                  {currentUserPic.length > 0 &&
                    currentUserPic.map((pic) => (
                      <div>
                        <Avatar
                          alt="image"
                          key={pic?.data().datePostedOn}
                          src={pic?.data().imageUrl}
                          sx={{
                            width: 35,
                            height: 35,
                            boxShadow: "var(--box_shadow)",
                          }}
                        />
                      </div>
                    ))}

                  {currentUserPic.length === 0 && (
                    <Avatar
                      alt="image"
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      sx={{
                        width: 35,
                        height: 35,
                        boxShadow: "var(--box_shadow)",
                      }}
                    />
                  )}
                </div>
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
                  backgroundColor: "transparent",
                  border: "none",
                },
              }}
            >
              <MenuItem>
                <Button
                  component={Link}
                  to={`/profile/${auth.currentUser?.displayName}`}
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  sx={{
                    marginBottom: "5px",
                    color: "#57636F",
                    border: "none",
                    fontStyle: "italic",
                    "&:hover": {
                      border: "none",
                      backgroundColor: "#57636f",
                      color: "#fff",
                      fontStyle: "normal",
                    },
                  }}
                >
                  Profile
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  sx={{
                    marginBottom: "5px",
                    color: "#57636F",
                    border: "none",
                    fontStyle: "italic",
                    "&:hover": {
                      border: "none",
                      backgroundColor: "#57636f",
                      color: "#fff",
                      fontStyle: "normal",
                    },
                  }}
                >
                  Logout
                </Button>
                <CustomSnackbar
                  open={showSnackbar}
                  message="Come back. You are out on space."
                  variant="success"
                  onClose={handleSnackbarClose}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
