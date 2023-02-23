import React, { useContext, useState } from "react";
import firebaseContex from "../../context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { Divider, IconButton, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import { blueGrey } from "@mui/material/colors";

const SearchUser = () => {
  const { isSearch, setIsSearch, allUsers } = useContext(firebaseContex);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filterUsername = allUsers
    .map((user) => user.data())
    .filter((val) => val?.username?.includes(searchQuery.toLowerCase()));

  const handleRedirect = (username) => {
    navigate(`/profile/${username}`);
    setIsSearch(false);
    setSearchQuery("");
  };

  return (
    <Dialog onClose={() => setIsSearch(false)} open={isSearch}>
      <Box
        sx={{
          bgcolor: "white",
          height: "50%",
          position: "fixed",
          top: "0",
          left: "30px",
          borderBottomRightRadius: "15px",
          borderBottomLeftRadius: "15px",
          width: "400px",
        }}
      >
        <Stack direction={"column"} sx={{ width: "100%" }}>
          <Typography variant="body1" sx={{ margin: "10px" }}>
            Looking for who?
          </Typography>
        </Stack>

        <TextField
          type="text"
          placeholder="Search by username"
          aria-label="Search user by username"
          aria-required="true"
          autoComplete="off"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          sx={{
            width: "100%",
            paddingRight: "20px",
            paddingLeft: "20px",
            marginBottom: "15px",
          }}
        />
        <Divider />

        <Typography variant="body2" sx={{ margin: "10px" }}>
          Results
        </Typography>

        {searchQuery &&
          filterUsername.map((users) => (
            <Stack
              direction="row"
              sx={{
                bgcolor: "lightgray",
                margin: "10px",
                padding: "10px",
              }}
              key={users.userId}
              component={Box}
              onClick={() => handleRedirect(users.username)}
            >
              <Avatar
                sx={{ bgcolor: blueGrey[500], textDecoration: "none" }}
                aria-label="recipe"
              >
                {users.username.charAt(0)}
              </Avatar>

              <Stack direction="column" sx={{ marginLeft: "10px" }}>
                <Typography variant="body1">{users.username}</Typography>
                <Typography variant="subtitle2">{users.fullName}</Typography>
              </Stack>
            </Stack>
          ))}
        {!filterUsername.length && (
          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
            No user found
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default SearchUser;
