import { Card } from "@mui/material";
import React from "react";
import "./RightNavbar.css";
import SuggestionList from "./suggestionList/SuggestionList";
import CardContent from "@mui/material/CardContent";

const RightNavbar = ({ currentUserInfo, suggestedUsers }) => {
  const shuffleArr = suggestedUsers.sort(() => 0.5 - Math.random());

  return (
    <Card
      elevation={24}
      sx={{
        maxWidth: 350,
        borderRadius: "15px",
        backgroundColor: "var(--card_color)",
        color: "var(--text_color)",
        boxShadow: "var(--box_shadow)",
      }}
    >
      <CardContent>
        <div className="suggestion-title">Suggestions For You</div>
        <div className="suggestion-user-list">
          {shuffleArr.slice(0, 5).map((users) => (
            <SuggestionList
              users={users.data()}
              key={users.id}
              usersId={users.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RightNavbar;
