import React, { useState } from "react";
import "./PostCard.css";
import { FiHeart } from "react-icons/fi";
import { updateDoc, arrayUnion, doc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../config/FirebaseConfig";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { blueGrey, red } from "@mui/material/colors";
import { Box, Button, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";

const PostCard = ({ post, postId, setAlertMessage }) => {
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comments, setComments] = useState("");
  const [isClick, setIsClick] = useState(false);
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

  const handlePostComments = async () => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          username: auth.currentUser.displayName,
          comment: comments,
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
  const handleDeleteComment = async (userName, userComment) => {
    try {
      await updateDoc(commentRef, {
        comments: arrayRemove({
          username: userName,
          comment: userComment,
        }),
      });
      setComments("");
      console.log(userComment);
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
      setComments("");
    }
  };

  return (
    <div className="card-container">
      <Card elevation={24} sx={{ maxWidth: 800, borderRadius: "15px" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: blueGrey[500], textDecoration: "none" }}
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
            post.datePostedOn.toDate().toLocaleDateString("en-US") !=
            currentDate
              ? post.datePostedOn.toDate().toLocaleDateString("en-US")
              : post.datePostedOn.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
          }
        />
        <Typography
          sx={{
            fontFamily: "monospace",
            textDecoration: "none",
            paddingLeft: "30px",
            marginBottom: "10px",
            paddingRight: "30px",
          }}
        >
          {post.caption}
        </Typography>
        {post.imageUrl != null ? (
          <CardMedia
            component="img"
            height="100%"
            image={post.imageUrl}
            alt="Image Post"
          />
        ) : (
          " "
        )}

        <CardContent>
          <Stack direction="row" spacing={3}>
            <IconButton onClick={handleLikes}>
              <FiHeart
                style={{
                  width: "100%",
                  height: "100%",
                  fill: isLiked.length > 0 && "red",
                  color: isLiked.length > 0 && "red",
                }}
              />
            </IconButton>

            <TextField
              placeholder="Add a comment"
              onChange={(e) => setComments(e.target.value)}
              value={comments ?? ""}
              sx={{ width: "90%" }}
            />
            <IconButton
              disabled={invalid}
              onClick={handlePostComments}
              color="inherit"
            >
              <SendIcon />
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
                <Avatar sx={{ bgcolor: blueGrey[500], textDecoration: "none" }}>
                  {data.username.charAt(0)}
                </Avatar>
                <Box
                  sx={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    justifyContent: "flex-start",
                    bgcolor: "lightblue",
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
                  {auth.currentUser?.displayName != data.username ? (
                    " "
                  ) : (
                    <Button
                      size="small"
                      onClick={() =>
                        handleDeleteComment(data.username, data.comment)
                      }
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Stack>
            </Stack>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCard;
