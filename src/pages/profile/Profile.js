import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import CreatePost from "../../components/createPost/CreatePost";
import Navbar from "../../components/navbar/Navbar";
import firebaseContex from "../../context/FirebaseContext";
import Editprofile from "./Editprofile";
import ProfileSkeleton from "./ProfileSkeleton";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  deleteDoc,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";

import { auth, db, storage } from "../../config/FirebaseConfig";
import { useParams } from "react-router-dom";

import SearchUser from "../../components/searchUser/SearchUser";
import Loading from "../../components/loading/Loading";
import PostCardOutline from "../../components/postCard/PostCardOutline";
import PostCard from "../../components/postCard/PostCard";
import CustomSnackbar from "../../components/snackbar/snackbar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { ImageList, ImageListItem } from "@mui/material";
import { Typography } from "@mui/material";
import AddPhotoAlternateTwoToneIcon from "@mui/icons-material/AddPhotoAlternateTwoTone";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

const Profile = () => {
  const { allUsers, loading, setLoading, posts } = useContext(firebaseContex);
  const localUser = JSON.parse(localStorage.getItem("authUser"));
  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [message, setMessage] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const [image, setImage] = useState([]);
  const [currentUserPic, setCurrentUserPic] = useState([]);

  const [imageC, setImageC] = useState([]);
  const [currentUserCover, setCurrentUserCover] = useState([]);

  const { username } = useParams();

  const getCurrentUserPosts = () => {
    const postRef = collection(db, "posts");
    const q = query(postRef, where("username", "==", username));

    onSnapshot(q, (querySnapshot) => {
      setCurrentUserPosts(querySnapshot.docs);
      setLoading(false);
    });
  };

  const allUsersData = allUsers.map((user) => user.data());
  const currentUserInfo = allUsersData.filter(
    (val) => val?.username === username
  );

  const localUserData = allUsersData.filter((val) => {
    return localUser?.uid === val.userId;
  });

  const isFollowing = localUserData
    .map((data) => data.following)[0]
    ?.filter((val) => val?.username === username);

  const handleClick = async (username, userId) => {
    setLoadingSpinner(true);
    if (!isFollowing.length) {
      await updateDoc(doc(db, "userinfo", auth.currentUser.uid), {
        following: arrayUnion({
          username,
        }),
      });
      await updateDoc(doc(db, "userinfo", userId), {
        follower: arrayUnion({
          username: auth.currentUser.displayName,
        }),
      });
    } else {
      await updateDoc(doc(db, "userinfo", auth.currentUser.uid), {
        following: arrayRemove({
          username,
        }),
      });
      await updateDoc(doc(db, "userinfo", userId), {
        follower: arrayRemove({
          username: auth.currentUser.displayName,
        }),
      });
    }
    setLoadingSpinner(false);
  };

  useEffect(() => {
    getCurrentUserPosts();
    getUserPic();
    getCoverPic();
  }, [username]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (e) => {
    await deleteDoc(doc(db, "posts", e));
    setMessage("Your post is out on space.");
    setShowSnackbar(true);
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedTypes.includes(imageFile.type)) {
      setImage(imageFile);
      console.log(imageFile);
    } else {
      alert("Please select an image file (jpg, png or gif)");

      e.target.value = "";

      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    const imageName = image.name;
    const imageRef = ref(storage, `/images/${imageName}`);

    await uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            addDoc(collection(db, "profile"), {
              userId: auth.currentUser.uid,
              datePostedOn: serverTimestamp(),
              imageUrl: url,
              username: auth.currentUser.displayName,
            });
          })
          .catch((error) => {
            console.log(error.message, "ERROR GETTING THE IMAGE URL");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const getUserPic = () => {
    const postRef = collection(db, "profile");
    const q = query(
      postRef,
      where("username", "==", username),
      orderBy("datePostedOn", "desc"),
      limit(1)
    );

    onSnapshot(q, (querySnapshot) => {
      setCurrentUserPic(querySnapshot.docs);
    });
  };

  const handleImageChangeCover = (e) => {
    const imageFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedTypes.includes(imageFile.type)) {
      setImageC(imageFile);
      console.log(imageFile);
    } else {
      alert("Please select an image file (jpg, png or gif)");
      e.target.value = "";

      e.target.value = "";
    }
  };

  const handleSubmitCover = async () => {
    const imageName = image.name;
    const imageRef = ref(storage, `/coverphoto/${imageName}`);

    await uploadBytes(imageRef, imageC)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            addDoc(collection(db, "coverphoto"), {
              userId: auth.currentUser.uid,
              datePostedOn: serverTimestamp(),
              imageUrl: url,
              username: auth.currentUser.displayName,
            });
          })
          .catch((error) => {
            console.log(error.message, "ERROR GETTING THE IMAGE URL");
          });
      })

      .catch((error) => {
        console.log(error.message);
      });
  };

  const getCoverPic = () => {
    const postRef = collection(db, "coverphoto");
    const q = query(
      postRef,
      where("username", "==", username),
      orderBy("datePostedOn", "desc"),
      limit(1)
    );

    onSnapshot(q, (querySnapshot) => {
      setCurrentUserCover(querySnapshot.docs);
    });
  };

  return (
    <div className="profile-page-section">
      <Navbar />

      <div className="profile-bg">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          currentUserInfo.map((currentUser) => (
            <div className="profile-details-section" key={currentUser.userId}>
              <div className="profile-banner-container">
                <div className="profile-banner">
                  {currentUserCover.length > 0 &&
                    currentUserCover.map((cover) => (
                      <div className="profile-banner">
                        <img
                          key={cover?.data().datePostedOn}
                          src={cover?.data().imageUrl}
                          className="banner"
                        />
                      </div>
                    ))}

                  {currentUserCover.length === 0 && (
                    <img src="/images/sample/1.jpg" className="banner"></img>
                  )}
                </div>

                <div className="profile-image-wrapper">
                  {currentUserPic.length > 0 &&
                    currentUserPic.map((pic) => (
                      <div>
                        <img
                          alt="image"
                          key={pic?.data().datePostedOn}
                          src={pic?.data().imageUrl}
                        />
                      </div>
                    ))}

                  {currentUserPic.length === 0 && (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      alt="user-profile"
                    />
                  )}
                </div>
              </div>

              <div className="profile-image-details-wrapper">
                <div className="profile-details-wrapper">
                  <div className="profile-username-follow-wrapper ">
                    <div className="profile-username">
                      <span id="username">@{currentUser?.username}</span>
                      <br />
                      <span id="fullname">
                        (<i>{currentUser.fullName}</i>)
                      </span>
                    </div>

                    {localUserData[0].username !== currentUser.username && (
                      <div className="profile-follow-unfollow-btn-wrapper">
                        <button
                          type="button"
                          className="profile-follow-unfollow-btn cur-point"
                          onClick={() =>
                            handleClick(
                              currentUser.username,
                              currentUser.userId
                            )
                          }
                          style={{
                            background: isFollowing.length ? "#efefef" : "",
                            color: isFollowing.length ? "black" : "",
                          }}
                        >
                          {!isFollowing.length ? "Follow" : "Unfollow"}
                        </button>
                        {loadingSpinner && <Loading />}
                      </div>
                    )}
                  </div>

                  <div className="posts-followers-details-wrapper absolute-center">
                    <div className="total-posts-wrapper total-wrapper absolute-center">
                      <span className="font-w-500 total-number">
                        {currentUserPosts.length}
                      </span>
                      Post
                    </div>
                    <div className="total-followers-wrapper total-wrapper absolute-center">
                      <span className="font-w-500 total-number">
                        {currentUser.follower?.length}
                      </span>
                      Followers
                    </div>
                    <div className="total-following-wrapper total-wrapper absolute-center">
                      <span className="font-w-500 total-number">
                        {currentUser.following?.length}
                      </span>
                      Following
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-profile">
                {localUserData[0].username === currentUser.username && (
                  <div>
                    <Editprofile>
                      <div>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <h4>Change profile picture</h4>
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                          >
                            <input
                              hidden
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={handleImageChange}
                            />
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                          </IconButton>
                          <Button
                            onClick={handleSubmit}
                            variant="contained"
                            component="label"
                          >
                            Upload
                          </Button>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={3}>
                          <h4>Change cover photo</h4>
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                          >
                            <input
                              hidden
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={handleImageChangeCover}
                            />
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                          </IconButton>
                          <Button
                            onClick={handleSubmitCover}
                            variant="contained"
                            component="label"
                          >
                            Upload
                          </Button>
                        </Stack>
                      </div>
                    </Editprofile>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {currentUserInfo.map(
          (currentUser) =>
            localUserData[0].username === currentUser.username && <CreatePost />
        )}
        <div>
          <ImageList
            variant="masonry"
            sx={{
              columnCount: {
                xs: "1 !important",
                sm: "2 !important",
                md: "3 !important",
                lg: "3 !important",
                xl: "3 !important",
              },
              padding: "1%",
            }}
            gap={0}
          >
            {loading ? (
              <PostCardOutline />
            ) : (
              currentUserPosts.map((post) => (
                <ImageListItem key={post.id}>
                  <PostCard
                    key={post.id}
                    post={post.data()}
                    postId={post.id}
                    setAlertMessage={setAlertMessage}
                  />
                </ImageListItem>
              ))
            )}
          </ImageList>
          {!currentUserPosts.length && (
            <Typography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "5%",
              }}
            >
              No Posts Available
            </Typography>
          )}
        </div>
      </div>
      <CustomSnackbar
        open={showSnackbar}
        message={message}
        variant="success"
        onClose={handleSnackbarClose}
      />

      <SearchUser />
    </div>
  );
};

export default Profile;
