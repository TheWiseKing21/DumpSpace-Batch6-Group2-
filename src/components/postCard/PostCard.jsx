import React, { useState, useEffect } from "react";
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
import {
  Box,
  Menu,
  Button,
  MenuItem,
  TextField,
  CardActions,
  Tooltip,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CustomSnackbar from "../snackbar/snackbar";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Backdrop from "@mui/material/Backdrop";
import Container from "@mui/material/Container";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";



import { collection,onSnapshot, query, where, orderBy, Timestamp, limit } from 'firebase/firestore'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));


const PostCard = ({ post, postId, setAlertMessage }) => {
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comments, setComments] = useState("");
  const [isClick, setIsClick] = useState(false);
  const currentDate = new Date().toLocaleDateString("en-US");
  const [message, setMessage] = useState("");

  const [currentUserPic, setCurrentUserPic] = useState([]);

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
      setMessage("Your comment is on space.");
      setShowSnackbar(true);
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
      setComments("");
    }
  };

  const commentRef = doc(db, "posts", postId);
  const handleDeleteComment = async (userName, userComment, userCommentId) => {
    setMessage("Your comment is out on space.");
    setShowSnackbar(true);
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
    setMessage("Your post is out on space.");
    setShowSnackbar(true);
    try {
      await deleteDoc(doc(db, "posts", e));
    } catch (error){
      console.log(error);
    }
    setTimeout(() => {
      setShowSnackbar(false);
    }, 10000);
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

  ////////////////////////////////////PROFILE PICTURE/////////////////////////////////////
  const getUserPic = () => {
    const postRef = collection(db, "profile");
    const q = query(postRef, where('username', '==', post.username), orderBy('datePostedOn', "desc"), limit(1));

    onSnapshot(q, (querySnapshot) => {
      console.log(querySnapshot.docs)
      setCurrentUserPic(querySnapshot.docs)
      
    });



  }

  useEffect(() => {
    
    getUserPic()
    
  }, [post.username])

  return (
    <>
      <Container maxWidth="md" sx={{ marginBottom: "20px" }} className="card-container">
        <Card
          elevation={24}
          sx={{
            maxWidth: 800,
            borderRadius: "15px",
            backgroundColor: "var(--card_color)",
            color: "var(--text_color)",
            boxShadow: "var(--box_shadow)"
          }}
        >
          <CardHeader
            avatar = {
              <div>
              {currentUserPic.length > 0 &&
                      currentUserPic.map((pic) => 
                      <div>
                      <Avatar
                        alt="image"
                        key = {pic?.data().datePostedOn}
                        src = {pic?.data().imageUrl}
                        sx={{ width: 50, height: 50 }}
        
                      /></div>)
              }

              {currentUserPic.length === 0 &&
                <Avatar
                        alt="image"
                        src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        sx={{ width: 50, height: 50 }}
        
                      />
              }


            </div>
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

            subheaderTypographyProps={{ color: "var(--text_color)" }}
            action={
              auth.currentUser.displayName === post.username ? (
                <div>
                  <IconButton onClick={handlePostOptionClick}>
                    <MoreVertIcon sx={{ color: "var(--text_color)" }} />
                  </IconButton>
                  <Menu
                    anchorEl={postAnchor}
                    open={openPostOption}
                    onClose={handlePostOptionClose}
                    PaperProps={{
                      style: { backgroundColor: "var(--home_background)", boxShadow: "var(--box_shadow)" }

                    }}
                  >
                    <Button onClick={() => handleDeletePost(postId)} variant="outlined" startIcon={<DeleteIcon />}
                      sx={{ color: "#57636F", border: "none", '&:hover': { border: "none", backgroundColor: "var(--button)", color: "var(--text_color)" } }}>
                      Delete Post
                    </Button>
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
                // fontFamily: "monospace",
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
                  style={{
                    width: "100%",
                    height: "100%",
                    fill: isLiked.length > 0 && "#810955",
                    color: isLiked.length > 0 && "#810955",
                    color: "var(--text_color)"
                  }}
                />
              </IconButton>
              <TextField
                placeholder="Add a comment"
                onChange={(e) => setComments(e.target.value)}
                value={comments ?? ""}
                sx={{
                  width: "90%",

                }}
              />
              <IconButton
                disabled={invalid}
                onClick={handlePostComments}
                color="inherit"
              >
                <RocketLaunchOutlinedIcon
                  sx={{ color: "var(--body_color)" }}
                />
                <CustomSnackbar
                  open={showSnackbar}
                  message={message}
                  variant="success"
                  onClose={handleSnackbarClose}
                />
              </IconButton>
            </Stack>
          </CardContent>
          {post.comments?.length > 3 ? (
            <>
              <CardActions>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <Typography sx={{ marginRight: "5px", color:  "var(--button)", '&:hover': { color: "var(--text_color)"} }}>
                    View other comments
                  </Typography>
                  <CommentIcon sx={{ color: "var(--button)", '&:hover': { color: "var(--text_color)" } }} />
                </ExpandMore>
              </CardActions>

              <CardContent>
                {post.comments?.map((data, index) =>
                  data.commentId > 2 ? (
                    <Collapse
                      key={data.commentId}
                      in={expanded}
                      timeout="auto"
                      unmountOnExit
                    >
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
                          <Avatar
                            sx={{
                              bgcolor: "#57636F",
                              textDecoration: "none",
                            }}
                          >
                            {data.username.charAt(0)}
                          </Avatar>
                          <Box
                            sx={{
                              marginLeft: "10px",
                              marginRight: "10px",
                              justifyContent: "flex-start",
                              bgcolor: "#57636F",
                              borderRadius: "10px",
                              padding: "10px",
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
                          </Box>
                          {auth.currentUser?.displayName != data.username ? (
                            " "
                          ) : (
                            <Tooltip title="Delete comment">
                              <IconButton
                                size="small"
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteComment(
                                    data.username,
                                    data.comment,
                                    data.commentId
                                  )
                                }
                              >
                                <DeleteIcon sx={{ color: "#57636F", '&:hover': { color: "var(--text_color)" } }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Stack>
                    </Collapse>
                  ) : (
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
                        <Avatar
                          sx={{
                            bgcolor: "#57636F",
                            textDecoration: "none",
                          }}
                        >
                          {data.username.charAt(0)}
                        </Avatar>
                        <Box
                          sx={{
                            marginLeft: "10px",
                            marginRight: "10px",
                            justifyContent: "flex-start",
                            bgcolor: "#57636F",
                            borderRadius: "10px",
                            padding: "10px",
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
                        </Box>
                        {auth.currentUser?.displayName != data.username ? (
                          " "
                        ) : (
                          <Tooltip title="Delete comment">
                            <IconButton
                              size="small"
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteComment(
                                  data.username,
                                  data.comment,
                                  data.commentId
                                )
                              }
                            >
                              <DeleteIcon sx={{ color: "#57636F", '&:hover': { color: "var(--text_color)" } }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  )
                )}
              </CardContent>
            </>
          ) : (
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
                    <Avatar
                      sx={{ bgcolor: "#57636F", textDecoration: "none" }}
                    >
                      {data.username.charAt(0)}
                    </Avatar>
                    <Box
                      sx={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        justifyContent: "flex-start",
                        bgcolor: "#57636F",
                        borderRadius: "10px",
                        padding: "10px",
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
                    </Box>
                    {auth.currentUser?.displayName != data.username ? (
                      " "
                    ) : (
                      <Tooltip title="Delete comment">
                        <IconButton
                          size="small"
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteComment(
                              data.username,
                              data.comment,
                              data.commentId
                            )
                          }
                        >
                          <DeleteIcon sx={{ color: "#57636F", '&:hover': { color: "var(--text_color)" } }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              ))}
            </CardContent>
          )}
        </Card>

        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={openPostDetails}
        >
          <Card
            elevation={24}
            sx={{
              width: 900,
              borderRadius: "15px",
              maxHeight: "80%",
              overflow: "auto",
              backgroundColor: "var(--card_color)",
              color: "var(--text_color)",

            }}
          >
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
              titleTypographyProps={{ fontWeight: "600", variant: "body1", color: "var(--text_color)" }}
              subheader={
                post.datePostedOn.toDate().toLocaleDateString("en-US") !==
                  currentDate
                  ? post.datePostedOn.toDate().toLocaleDateString("en-US")
                  : post.datePostedOn.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
              }
              subheaderTypographyProps={{ color: "var(--text_color)" }}
              action={
                <div>
                  <IconButton onClick={handlePostDetailsOptionClick}>
                    <MoreVertIcon sx={{ color: "var(--text_color)" }} />
                  </IconButton>
                  {auth.currentUser.displayName === post.username ? (
                    <Menu
                      anchorEl={postDetailsAnchor}
                      open={openPostDetailsOption}
                      onClose={handlePostDetailsOptionClose}
                      PaperProps={{
                        style: { backgroundColor: "var(--home_background)", boxShadow: "var(--box_shadow)" }

                      }}
                    >
                      <Button onClick={() => handleDeletePost(postId)} variant="outlined" startIcon={<DeleteIcon />}
                        sx={{ color: "#57636F", borderColor: "#57636F", '&:hover': { borderColor: '#57636F', textColor: "#57636F", backgroundColor: "var(--button)", color: "var(--text_color)" } }}>
                        Delete Post
                      </Button>
                      <br></br>
                      <Button onClick={handleCloseDetails} variant="outlined" startIcon={<CloseIcon />}
                        sx={{ marginTop: "5px", color: "#57636F", borderColor: "#57636F", '&:hover': { borderColor: '#57636F', backgroundColor: "var(--button)", color: "var(--text_color)" } }}>
                        Close
                      </Button>
                    </Menu>
                  ) : (
                    <Menu
                      anchorEl={postDetailsAnchor}
                      open={openPostDetailsOption}
                      onClose={handlePostDetailsOptionClose}
                      PaperProps={{
                        style: { backgroundColor: "var(--home_background)", boxShadow: "var(--box_shadow)" }

                      }}
                    >
                      <br></br><Button onClick={handleCloseDetails} variant="outlined" startIcon={<CloseIcon />}
                        sx={{ marginTop: "5px", color: "#57636F", borderColor: "#57636F", '&:hover': { borderColor: '#57636F', backgroundColor: "var(--button)", color: "var(--text_color)" } }}>
                        Close
                      </Button>
                    </Menu>
                  )}
                </div>
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
                      fill: isLiked.length > 0 && "#810955",
                      color: isLiked.length > 0 && "#810955",
                      color: "var(--text_color)"
                    }}
                  />
                </IconButton>

                <TextField
                  className="comment-container"
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
                  <RocketLaunchOutlinedIcon
                    sx={{ color: "var(--body_color)" }}
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
                    </Box>
                    {auth.currentUser?.displayName != data.username ? (
                      " "
                    ) : (
                      <Tooltip title="Delete comment">
                        <IconButton
                          size="small"
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteComment(
                              data.username,
                              data.comment,
                              data.commentId
                            )
                          }
                        >
                          <DeleteIcon sx={{ color: "#57636F", '&:hover': { color: "var(--text_color)" } }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Backdrop>
      </Container>
    </>
  );
};

export default PostCard;
