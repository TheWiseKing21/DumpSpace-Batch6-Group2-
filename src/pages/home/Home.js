import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import CreatePost from "../../components/createPost/CreatePost";
import PostCard from "../../components/postCard/PostCard";
import firebaseContex from "../../context/FirebaseContext";
import "./Home.css";
import { RxCross2 } from "react-icons/rx";

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

  return (
    <>
      <Navbar />
      <div className="home-page-container">
        <div>
          <CreatePost />
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post.data()}
                postId={post.id}
                setAlertMessage={setAlertMessage}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
