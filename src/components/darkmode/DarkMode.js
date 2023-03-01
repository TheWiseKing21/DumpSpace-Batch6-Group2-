import React from "react";
import { ReactComponent as Sun } from "../../assets/img/Sun.svg";
import { ReactComponent as Moon } from "../../assets/img/Moon.svg";
import "./DarkMode.css";

const DarkMode = ({ setDarkMode }) => {
  const setDarkTheme = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    setDarkMode(true);
  };

  const setLightTheme = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    setDarkMode(false);
  };

  const toggleTheme = (e) => {
    if (e.target.checked) setDarkTheme();
    else setLightTheme();
  };
  
  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
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
