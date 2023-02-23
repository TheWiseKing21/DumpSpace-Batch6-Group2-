import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import CreatePost from "../../components/createPost/CreatePost";
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
      <CreatePost />
    </>
  );
};

export default Home;
