import React, { useContext, useEffect, useState } from "react";

import CreatePost from "../../components/createPost/CreatePost";
import Navbar from "../../components/navbar/Navbar";
import firebaseContex from "../../context/FirebaseContext";
import "./Profile.css";
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
  limit
} from "firebase/firestore";

import { auth, db, storage } from "../../config/FirebaseConfig";
import { useParams } from "react-router-dom";

import SearchUser from "../../components/searchUser/SearchUser";
import Loading from "../../components/loading/Loading";

// import List from "@mui/material/List";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import PostCardOutline from "../../components/postCard/PostCardOutline";
import PostCard from "../../components/postCard/PostCard";
import Container from "@mui/material/Container";
import CustomSnackbar from "../../components/snackbar/snackbar";


import {ref, uploadBytes, getDownloadURL} from "firebase/storage"

import { Avatar } from '@mui/material'



const Profile = () => {
  const { allUsers, loading, setLoading, posts } = useContext(firebaseContex);
  const localUser = JSON.parse(localStorage.getItem("authUser"));
  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //new const for snackbar
  const [message, setMessage] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

   //UPLOAD PROFILE PICTURE
   const [image, setImage] = useState([]);
   const [currentUserPic, setCurrentUserPic] = useState([]);

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
    getUserPic();
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


  /////////////////////////////PROFILE PICTURE///////////////////////////////////////
  const handleImageChange = (e) =>{
    const imageFile = e.target.files[0]
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if(allowedTypes.includes(imageFile.type)){
      setImage(imageFile)
      console.log(imageFile)
    }else{
      alert('Please select an image file (jpg, png or gif)');
      e.target.value = ''; // Reset the input field to clear the selected file
    }
  }

  const handleSubmit = async () =>{
    const imageName = image.name; //the name of the file in the database will be the same name file as uploaded
    const imageRef = ref(storage, `/images/${imageName}`);
    
    await uploadBytes(imageRef, image).then
    ( //uploading the file to firebase
      () => {
        getDownloadURL(imageRef).then(
          (url) => {
            addDoc(collection(db,'profile'),{
              userId: auth.currentUser.uid,
              datePostedOn: serverTimestamp(),
              imageUrl: url,
              username: auth.currentUser.displayName,
              

            })
        }).catch((error) => {
          console.log(error.message, "ERROR GETTING THE IMAGE URL")

        });
      }).catch((error)=>{
        console.log(error.message)

      })
  }


   // get current user's posts
   const getUserPic = () => {
    const postRef = collection(db, "profile");
    const q = query(postRef, where('username', '==', username), orderBy('datePostedOn', "desc"), limit(1));

    onSnapshot(q, (querySnapshot) => {
      
      setCurrentUserPic(querySnapshot.docs)
      
    })



  }


  return (
    <div className="profile-page-section" >
      <Navbar />

      <div className="profile-bg">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          currentUserInfo.map((currentUser) => (
            <div className="profile-details-section" key={currentUser.userId}>
              
              <div className="profile-banner-container">
                <div className="profile-banner">
                  <img src = "/images/sample/1.gif" className="banner"></img>
      
                  
                </div>
                <div className="profile-image-wrapper">
                  
                  {currentUserPic.length > 0 &&
                      currentUserPic.map((pic) => 
                      <div>
                      
                        <img
                        alt="image"
                        key = {pic?.data().datePostedOn}
                        src = {pic?.data().imageUrl}
                        /></div>)
                      
                    }

                    {currentUserPic.length === 0 &&
                     <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="user-profile" />
                    }
                </div>
              </div>
              
              
              
              
              
              <div className="profile-image-details-wrapper">
                
                <div className="profile-details-wrapper">
                  <div className="profile-username-follow-wrapper ">
                    <div className="profile-username">
                      <span id ="username">@{currentUser?.username}</span><br/>
                      <span id = "fullname">(<i>{currentUser.fullName}</i>)</span>
                      
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

              <div className = "edit-profile">
                {(localUserData[0].username === currentUser.username) && 
                    <div>
                      <Editprofile>
                        <div>
                        <h4>Change profile picture</h4>
                        <input type = "file" accept="image/jpeg,image/png,image/gif" onChange = {handleImageChange}/>
                        <button onClick={handleSubmit}>Upload profile picture</button>
                        </div>
                      </Editprofile> 
                    </div>
                    }  
              </div>
            </div>
          ))
        )}




        <Container maxWidth="md" sx={{ marginBottom: "20px" }}>
          <div>
            <CreatePost />
            <div className="profile-post-container">
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
              {!currentUserPosts.length && (
                <Typography
                  variant="h6"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  No Posts Available
                </Typography>
              )}
            </div>
          </div>
        </Container>
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
