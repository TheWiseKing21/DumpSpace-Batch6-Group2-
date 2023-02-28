import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import {
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/FirebaseConfig";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { blueGrey } from "@mui/material/colors";
import {
  Box,
  Menu,
  Button,
  MenuItem,
  TextField,
  Icon,
  CardActions,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CustomSnackbar from "../snackbar/snackbar";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Backdrop from "@mui/material/Backdrop";
import Container from "@mui/material/Container";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import CommentIcon from "@mui/icons-material/Comment";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

const PostCard = ({ post, postId, setAlertMessage }) => {
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comments, setComments] = useState("");
  const [setIsClick] = useState(false);
  const currentDate = new Date().toLocaleDateString("en-US");


    const invalid = comments === "";
    const isLiked = post.likes.filter(
      (value) => auth.currentUser.displayName === value.username
    );

    const handleLikes = async () => {
      setIsClick(true);
      try {
        if (isLiked.length !== 0) {
          setLikesCount(likesCount - 1);
          await updateDoc(doc(db, "posts", postId), {
            likes: arrayRemove({
              username: auth.currentUser.displayName,
            }),
          });
        } else {
          setLikesCount(likesCount + 1);
          await updateDoc(doc(db, "posts", postId), {
            likes: arrayUnion({
              username: auth.currentUser.displayName,
            }),
          });
        }
      } catch (error) {
        console.log(error);
        setAlertMessage(error.message);
      }
  
      setTimeout(() => {
        setIsClick(false);
      }, 1000);
    };

    //new const for snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const handleSnackbarClose = () => {
      setShowSnackbar(false);
    };

  const handlePostComments = async () => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          username: auth.currentUser.displayName,
          comment: comments,
          commentId: post.comments.length,

        }),
      });
      setComments("");
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
      setComments("");
    }
  };

    const commentRef = doc(db, "posts", postId);
    const handleDeleteComment = async (userName, userComment, userCommentId) => {
      try {
        await updateDoc(commentRef, {
          comments: arrayRemove({
            username: userName,
            comment: userComment,
            commentId: userCommentId,
        }),
        });
        setComments("");
        } catch (error) {
        console.log(error);
        setAlertMessage(error.message);
        setComments("");
      }
    };

  const [postAnchor, setPostAnchor] = React.useState(null);
  const openPostOption = Boolean(postAnchor);
  const handlePostOptionClick = (event) => {
    setPostAnchor(event.currentTarget);
  };
  const handlePostOptionClose = () => {
    setPostAnchor(null);
  };

  const [postDetailsAnchor, setPostDetailsAnchor] = React.useState(null);
  const openPostDetailsOption = Boolean(postDetailsAnchor);
  const handlePostDetailsOptionClick = (event) => {
    setPostDetailsAnchor(event.currentTarget);
  };
  const handlePostDetailsOptionClose = () => {
    setPostDetailsAnchor(null);
  };

  const handleDeletePost = async (e) => {
    await deleteDoc(doc(db, "posts", e));
  };

  const [openPostDetails, setOpenPostDetails] = React.useState(false);

  const handleClickOpenDetails = () => {
    setOpenPostDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenPostDetails(false);
    handlePostDetailsOptionClose();
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    return (
      <>
      <Container maxWidth="md" sx={{ marginBottom: "20px" }}>
          <Card elevation={24} sx={{ maxWidth: 800, borderRadius: "15px", backgroundColor: "var(--card_color)", color: "var(--text_color)" }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: "#57636F", textDecoration: "none" }}
                  aria-label="recipe"
                  component={Link}
                  to={`/profile/${post.username}`}
                >
                  {post.username.charAt(0)}
                </Avatar>
              }
              title={post.username}
              titleTypographyProps={{ fontWeight: "600", variant: "body1" }}
              subheader={
                post.datePostedOn.toDate().toLocaleDateString("en-US") !==
                  currentDate
                  ? post.datePostedOn.toDate().toLocaleDateString("en-US")
                  : post.datePostedOn.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })

                }
              action={
              auth.currentUser.displayName === post.username ? (
                <div>
                  <IconButton onClick={handlePostOptionClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={postAnchor}
                    open={openPostOption}
                    onClose={handlePostOptionClose}
                  >
                    <MenuItem onClick={() => handleDeletePost(postId)}>
                      Delete Post
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <></>
              )
            }
          />
            <CardContent onClick={handleClickOpenDetails}>
            <Typography
                sx={{
                      textDecoration: "none",
                  paddingLeft: "30px",
                  marginBottom: "10px",
                  paddingRight: "30px",
                }}
              >
                {post.caption}
              </Typography>
              {post.imageUrl !== null ? (
                <CardMedia
                  component="img"
                  height="100%"
                  image={post.imageUrl}
                  alt="Image Post"
                />
              ) : (
                " "
              )}
          </CardContent>
            <CardContent>
              <Stack direction="row" spacing={3}>
              <IconButton onClick={handleLikes}>
                  <FiHeart
                    sx={{
                      width: "100%",
                      height: "100%",
                      fill: isLiked.length > 0 && "red",
                      color: isLiked.length > 0 && "red",
                    
                    }}
                  />
                </IconButton>

              <TextField className="comment-container"
                placeholder="Add a comment"
                onChange={(e) => setComments(e.target.value)}
                value={comments ?? ""}
                variant="outlined"
                sx={{ width: "90%" }}
              />

              <IconButton
                disabled={invalid}
                onClick={handlePostComments}
                color={"inherit"}
              >
                <RocketLaunchOutlinedIcon sx={{ color: "var(--body_color)" }} />
                <CustomSnackbar
                  open={showSnackbar}
                  message="Your comment are posted."
                  variant="success"
                  onClose={handleSnackbarClose}
                />
              </IconButton>
            </Stack>
          </CardContent>
          <CardContent>
            {post.comments?.map((data, index) => (
              <Stack
                direction="column"
                sx={{
                  marginLeft: "20px",
                  marginBottom: "10px",
                  overflow: "inherit",
                }}
                key={index}
              >
                <Stack direction="row">
                  <Avatar sx={{ bgcolor: "#57636F", textDecoration: "none" }}>
                    {data.username.charAt(0)}
                  </Avatar>
                  <Box
                    sx={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      justifyContent: "flex-start",
                      backgroundColor: "#F8F9F9 ",
                      borderRadius: "10px",
                      padding: "10px",
                      bgcolor: "var(--body_background)",
                      // color: "var(--text_color)"

                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        marginLeft: "5px",
                        paddingTop: "10px",
                        fontWeight: "600",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      component={Link}
                      to={`/profile/${data.username}`}
                    >
                      {data.username}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        marginLeft: "10px",
                        paddingBottom: "5px",
                      }}
                    >
                      {data.comment}
                    </Typography>
                    {auth.currentUser?.displayName != data.username ? (
                      " "
                    ) : (
                      <><IconButton onClick={handleLikes}>
                          <FiHeart
                            style={{
                              width: "100%",
                              height: "100%",
                              fill: isLiked.length > 0 && "#A267AC",
                              color: isLiked.length > 0 && "#A267AC",
                              color: "var(--body_color);"
                            }} />
                        </IconButton><DeleteOutlinedIcon
                          size="small"
                          onClick={() => handleDeleteComment(data.username, data.comment, data.commentId)} /></>
                          
                      
                    )}
                  </Box>
                </Stack>
              </Stack>
            ))}
          </CardContent>
        </Card>
        </Container>
        </>
    );
  };

export default PostCard;
