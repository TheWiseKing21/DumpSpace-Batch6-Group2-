import React, { useEffect, useState } from "react";
import { ReactComponent as Sun } from "../../assets/img/Sun.svg";
import { ReactComponent as Moon } from "../../assets/img/Moon.svg";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./DarkMode.css";
import { auth, db } from "../../config/FirebaseConfig";

const DarkMode = ({ darkMode }) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (auth.currentUser !== null) {
      getDefaultTheme();
      if (toggle) {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    }
  });

  const setDarkTheme = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightTheme = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };

  const getDefaultTheme = async () => {
    const docRef = doc(db, "userinfo", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    setToggle(docSnap.data().isDark);
  };

  const setDefaultTheme = async (darkState) => {
    await updateDoc(doc(db, "userinfo", auth.currentUser.uid), {
      isDark: darkState,
    });
  };

  const toggleTheme = (e) => {
    if (e.target.checked) {
      setDefaultTheme(e.target.checked);
    } else {
      setDefaultTheme(e.target.checked);
    }
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        checked={toggle}
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
