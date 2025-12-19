import React from "react";
import { Layout } from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const { Content } = Layout;

export default function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content style={{ padding: 16, maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
}
