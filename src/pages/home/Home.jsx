import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import CreatePost from "../../components/createPost/CreatePost";
import PostCard from "../../components/postCard/PostCard";
import PostCardOutline from "../../components/postCard/PostCardOutline";
import SearchUser from "../../components/searchUser/SearchUser";
import firebaseContex from "../../context/FirebaseContext";
import Container from "@mui/material/Container";

const Home = () => {
  const { posts, allUsers, loading } = useContext(firebaseContex);
  const navigate = useNavigate();
  const [setAlertMessage] = useState("");

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
      <Container maxWidth="md">
        <div>
          <CreatePost />
          <div>
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
      </Container>
    </>
  );
};

export default Home;
