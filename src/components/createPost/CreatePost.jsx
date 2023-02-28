import React, { useRef, useState } from "react";
import { storage, db, auth } from "../../config/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import Loading from "../loading/Loading";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CustomSnackbar from "../snackbar/snackbar";

import Container from "@mui/material/Container";

function LinearProgressWithLabel(props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const CreatePost = () => {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);

  //new const for snackbar
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleUpload = () => {
    setShowSnackbar(true);
    if (image) {
      setLoading(true);
      const storageRef = ref(storage, `/images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percentage);
        },
        (error) => {
          console.log(error);
          setCaption("");
          imageRef.current.value = "";
          setProgress(0);
          setLoading(false);
          setMessage(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "posts"), {
            userId: auth.currentUser.uid,
            imageUrl: downloadURL,
            username: auth.currentUser.displayName,
            caption: caption,
            likes: [],
            comments: [],
            datePostedOn: new Date(),
          });

          setCaption("");
          imageRef.current.value = "";
          setImage("");
          setProgress(0);
          setLoading(false);
          setMessage("Image Upload Successfully");
          setTimeout(() => {
            setMessage("");
          }, 5000);
        }
      );
    } else if (caption) {
      setLoading(true);
      const storageRef = ref(storage, `/images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percentage);
        },
        (error) => {
          console.log(error);
          setCaption("");
          imageRef.current.value = "";
          setProgress(0);
          setLoading(false);
          setMessage(error.message);
        },
        async () => {
          await addDoc(collection(db, "posts"), {
            userId: auth.currentUser.uid,
            imageUrl: null,
            username: auth.currentUser.displayName,
            caption: caption,
            likes: [],
            comments: [],
            datePostedOn: new Date(),
          });

          setCaption("");
          imageRef.current.value = "";
          setProgress(0);
          setLoading(false);
        }
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: "20px" }}>
      <Card
        elevation={24}
        sx={{
          maxWidth: 800,
          borderRadius: "15px",
          marginTop: "20px",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "var(--card_color)",
          color: "var(--text_color)",
        }}
      >
        <CardContent>
          <Stack direction="column" spacing={3} maxWidth="100%">
            <TextField
              id="standard-multiline-flexible"
              label="Any dump thoughts?"
              multiline
              maxRows={4}
              variant="outlined"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              sx={{
                maxWidth: "100%",
                backgroundColor: "var(--home_background)",
                color: "white",
              }}
            />
          </Stack>
          <Stack direction="row" spacing={3} sx={{ marginTop: "10px" }}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ justifyContent: "left" }}
            >
              <input
                type="file"
                title="select image"
                placeholder="select image"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="image-select-input"
                ref={imageRef}
                hidden
              />
              <CameraAltOutlinedIcon />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!caption}
              sx={{ width: "90%", backgroundColor: "#57636F", color: "white" }}
            >
              Create post
              {loading && <Loading />}
            </Button>
            <CustomSnackbar
              open={showSnackbar}
              message="Your dump thoughts are on space."
              variant="success"
              onClose={handleSnackbarClose}
            />
          </Stack>
        </CardContent>
        {progress > 0 && <LinearProgressWithLabel value={progress} sx={{}} />}
        {message && (
          <div>
            <Typography>{message}</Typography>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default CreatePost;
