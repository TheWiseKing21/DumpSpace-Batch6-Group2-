import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";

const PostCardOutline = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ marginBottom: "20px" }}
      className="card-container"
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 800,
          borderRadius: "15px",
          backgroundColor: "var(--card_color)",
          color: "var(--text_color)",
          boxShadow: "var(--box_shadow)",
        }}
      >
        <CardHeader
          avatar={<Skeleton variant="circular" height={42} width={42} />}
          title={<Skeleton width={80} />}
          subheader={<Skeleton width={65} />}
        />

        <Skeleton sx={{ margin: "10px", width: 780, height: "500px" }} />

        <CardContent>
          <Skeleton height={42} />
          <Skeleton height={42} />
          <Skeleton height={42} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostCardOutline;
