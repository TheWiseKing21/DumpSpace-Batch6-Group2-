import { CardHeader, Typography } from "@mui/material";
import React from "react";
import "./ConnectionBar.css";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";

import CardContent from "@mui/material/CardContent";

const RightNavbar = ({ currentUserInfo, suggestedUsers }) => {
  //   const shuffleArr = suggestedUsers.sort(() => 0.5 - Math.random());

  return (
    <>
      <div>
        <div className="userprofile-suggestion-wrapper">
          <div className="userprofile-wrapper">
            <div className="userprofile-image-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="user-profile"
              />
            </div>

            {currentUserInfo.map((currentUser) => (
              <div className="username-fullname-wrapper" key={currentUser.id}>
                <div className="username-wrapper">
                  {currentUser.data().username}
                </div>
                <div className="fullname-wrapper">
                  {currentUser.data().fullName}
                </div>
              </div>
            ))}
          </div>

          <div className="suggestion-wrapper">
            <div className="suggestion-title">Connections</div>
            <div className="suggestion-user-list">
              {currentUserInfo.map((users) => (
                <div key={users.id}>
                  {users.data().following.map((follow, index) => (
                    <div className="userprofile-wrapper">
                      <div className="userprofile-image-wrapper">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          alt="user-profile"
                        />
                      </div>

                      <div className="username-fullname-wrapper" key={index}>
                        <div>{follow.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightNavbar;
