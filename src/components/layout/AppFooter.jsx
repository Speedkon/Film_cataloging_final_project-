import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      <Typography.Text type="secondary">
        created by Kateryna Kononikhina
      </Typography.Text>
    </Footer>
  );
}
