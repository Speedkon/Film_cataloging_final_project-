import React from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "antd";

export default function TitleDetails() {
  const { id } = useParams();

  return (
    <Card>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Title Details
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Title ID: <b>{id}</b>
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        Here we will show poster, cast, description, year, genres, rating (text only).
      </Typography.Paragraph>
    </Card>
  );
}
