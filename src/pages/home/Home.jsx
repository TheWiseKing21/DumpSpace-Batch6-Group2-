import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import CreatePost from "../../components/createPost/CreatePost";
import PostCard from "../../components/postCard/PostCard";
import PostCardOutline from "../../components/postCard/PostCardOutline";
import SearchUser from "../../components/searchUser/SearchUser";
import ConnectionBar from "../../components/connectionBar/ConnectionBar";
import firebaseContex from "../../context/FirebaseContext";
import "./Home.css";
import { RxCross2 } from "react-icons/rx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

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

  const currentUserInfo = allUsers.filter((val) => {
    return localUser?.uid === val.id;
  });

  // const connectionRef = doc(db, "userinfo", localUser.uid);
  // const connections = async () => {
  //   await getDoc(connectionRef);
  // };

  return (
    <>
      <Navbar />
      <div className="home-page-container">
        <div>
          <CreatePost />
          <div>
            {/* <ConnectionBar currentUserInfo={currentUserInfo} /> */}
            {loading ? (
              <PostCardOutline />
            ) : (
              posts.map((post) => (
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
        <SearchUser />
      </div>
    </>
  );
};

export default Home;
