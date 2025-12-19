import React from "react";
import { Card, Typography } from "antd";

export default function MyCatalog() {
  return (
    <Card>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        My Catalog
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Favorites + my ratings will be shown here.
      </Typography.Paragraph>
    </Card>
  );
}
