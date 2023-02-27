import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";

const PostCardOutline = () => {
  return (
    <Container fixed sx={{ marginBottom: "20px" }}>
      <Card elevation={24} sx={{ maxWidth: 800, borderRadius: "15px" }}>
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
