import React, { useMemo } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

export default function AppHeader() {
  const location = useLocation();

  const selectedKey = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/movies")) return "/movies";
    if (p.startsWith("/series")) return "/series";
    if (p.startsWith("/cartoons")) return "/cartoons";
    if (p.startsWith("/catalog")) return "/catalog";
    return "/";
  }, [location.pathname]);

  const items = [
    { key: "/", label: <Link to="/">Home</Link> },
    { key: "/movies", label: <Link to="/movies">Movies</Link> },
    { key: "/series", label: <Link to="/series">Series</Link> },
    { key: "/cartoons", label: <Link to="/cartoons">Cartoons</Link> },
    { key: "/catalog", label: <Link to="/catalog">My Catalog</Link> },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#111",
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 999,
          background: "#ff7a00",
          color: "#111",
          fontWeight: 800,
          textDecoration: "none",
        }}
        aria-label="Film Catalog Home"
        title="Film Catalog"
      >
        FC
      </Link>

      <div style={{ flex: 1 }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={items}
          style={{ background: "transparent" }}
        />
      </div>
    </Header>
  );
}
