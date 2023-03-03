import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import CreatePost from "../../components/createPost/CreatePost";
import PostCard from "../../components/postCard/PostCard";
import PostCardOutline from "../../components/postCard/PostCardOutline";
import SearchUser from "../../components/searchUser/SearchUser";
// import ConnectionBar from "../../components/connectionBar/ConnectionBar";
import firebaseContex from "../../context/FirebaseContext";
import "./Home.css";
// import { RxCross2 } from "react-icons/rx";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../config/FirebaseConfig";
import RightNavbar from "../../components/rightNavbar/RightNavbar";
import { ImageList, ImageListItem} from '@mui/material';

const Home = () => {
  const { posts, allUsers, loading, setIsUpload } = useContext(firebaseContex);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");

  const localUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    if (localUser === null) {
      navigate("/login");
    }
  }, [localUser]);

  const suggestedUsers = allUsers.filter((val) => {
    return localUser?.uid !== val.id;
  });

  const currentUserInfo = allUsers.filter((val) => {
    return localUser?.uid === val.id;
  });

  

  return (
    <>
      <Navbar />
      <div className="home-page-container">
        <div className="home-page">
          <div className="stars"></div>
          <CreatePost />
          
          <div className="home-page-feed">

          <ImageList variant="masonry" sx={{
              columnCount: {
                xs: '1 !important',
                sm: '2 !important',
                md: '2 !important',
                lg: '3 !important',
                xl: '3 !important',
              }, padding: "2%"
            }} gap={0}>

            {loading ? (
              <PostCardOutline />
            ) : (
              posts.map((post) => (
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
            
          </div>

        </div>

        <SearchUser />
        <RightNavbar
          currentUserInfo={currentUserInfo}
          suggestedUsers={suggestedUsers}
          localUser={localUser}
        />
      </div>
    </>
  );
};

export default Home;
