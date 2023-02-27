import React, { useContext, useEffect, useState } from "react";
import CreatePost from "../../components/createPost/CreatePost";
import Navbar from "../../components/navbar/Navbar";
import firebaseContex from "../../context/FirebaseContext";
import "./Profile.css";
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
} from "firebase/firestore";
import { auth, db } from "../../config/FirebaseConfig";
import { useParams } from "react-router-dom";
import SearchUser from "../../components/searchUser/SearchUser";
import Loading from "../../components/loading/Loading";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, IconButton } from "@mui/material";
import PostCardOutline from "../../components/postCard/PostCardOutline";
import PostCard from "../../components/postCard/PostCard";

const Profile = () => {
  const { allUsers, loading, setLoading, posts } = useContext(firebaseContex);
  const localUser = JSON.parse(localStorage.getItem("authUser"));
  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // get username form param
  const { username } = useParams();

  // get current user's posts
  const getCurrentUserPosts = () => {
    const postRef = collection(db, "posts");
    const q = query(postRef, where("username", "==", username));

    onSnapshot(q, (querySnapshot) => {
      setCurrentUserPosts(querySnapshot.docs);
      setLoading(false);
    });
  };
  // get and check userinfo from param
  const allUsersData = allUsers.map((user) => user.data());
  const currentUserInfo = allUsersData.filter(
    (val) => val?.username === username
  );

  // get localUser Data
  const localUserData = allUsersData.filter((val) => {
    return localUser?.uid === val.userId;
  });

  // to check username present in localuser following list
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
  };

  return (
    <div className="profile-page-section">
      <div className="top-instagram-logo">
        <img
          src="/images/Instagram_logo.svg"
          alt="instagram logo"
          className="instagram-logo"
        />
      </div>
      <Navbar />
      <SearchUser />
      <div className="profile-page-container">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          currentUserInfo.map((currentUser) => (
            <div className="profile-datails-section" key={currentUser.userId}>
              <div className="profile-image-details-wrapper absolute-center ">
                <div className="profile-image-wrapper">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="user-profile"
                  />
                </div>

                <div className="profile-details-wrapper">
                  <div className="profile-username-follow-wrapper ">
                    <div className="profile-username">
                      {currentUser?.username}
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
                      followers
                    </div>
                    <div className="total-following-wrapper total-wrapper absolute-center">
                      <span className="font-w-500 total-number">
                        {currentUser.following?.length}
                      </span>
                      following
                    </div>
                  </div>
                  <div className="profile-fullname-wrapper font-w-500">
                    {currentUser.fullName}
                  </div>
                </div>
              </div>

              <div className="mobile-screen">
                <div className="profile-fullname-wrapper font-w-500">
                  {currentUser.fullName}
                </div>
              </div>
            </div>
          ))
        )}

        <div className="posts-list-section">
          <div
            className="posts-list-container"
            // style={{
            //   width: "800px",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   marginLeft: "220px",
            // }}
          >
            <div>
              <CreatePost />
              <div>
                {loading ? (
                  <PostCardOutline />
                ) : (
                  currentUserPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post.data()}
                      postId={post.id}
                      setAlertMessage={setAlertMessage}
                    />
                  ))
                )}
              </div>
            </div>

            {/* {loading ? (
            <ExploreCardSkeleton number={1} />
          ) : (
            currentUserPosts.map((post) => (
              <>
                <List>
                  <Card sx={{ maxWidth: 800 }} key={post.id}>
                    <CardHeader
                      avatar={
                        <div className="image-wrapper absolute-center">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="user-profile"
                          />
                        </div>
                      }
                      title={post.username}
                      subheader={post.caption}
                    />
                    <CardMedia
                      component="img"
                      height="100%"
                      image={post.data().imageUrl}
                      alt="post"
                    />
                    <CardContent></CardContent>
                    <CardActions disableSpacing>
                      <div classname="morevert">
                        {auth.currentUser.displayName !== post.username ? (
                          <>
                            <IconButton onClick={handleMenu}>
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleDelete(post.id)}>
                                Delete
                              </MenuItem>
                            </Menu>
                            {console.log(post.userId)}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </List>
              </>
            ))
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
