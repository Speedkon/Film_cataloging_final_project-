import React, { useMemo } from "react";
import { Card, Divider, Space, Button, Typography, Rate, Tag } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";

const { Text } = Typography;

export default function TitleCard({ item }) {
  const { isFavorite, toggleFavorite, getRating, setRating } = useCatalog();

  const fav = isFavorite(item.key);
  const myRating = getRating(item.key);

  const genres = useMemo(() => (item.genres || []).slice(0, 3), [item.genres]);

  return (
    <Card
      hoverable
      cover={
        <Link to={`/title/${item.mediaType}/${item.id}`} style={{ display: "block" }}>
          <div style={{ aspectRatio: "2 / 3", overflow: "hidden", background: "#111" }}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div style={{ color: "#fff", padding: 12 }}>No image</div>
            )}
          </div>
        </Link>
      }
    >
      <Space orientation="vertical" size={6} style={{ width: "100%" }}>
        <Link to={`/title/${item.mediaType}/${item.id}`} style={{ textDecoration: "none" }}>
          <Text strong style={{ fontSize: 16, color: "#111" }}>
            {item.title}
          </Text>
        </Link>

        <Space wrap size={[6, 6]}>
          {typeof item.year === "number" && <Tag>{item.year}</Tag>}
          {genres.map((g) => (
            <Tag key={g}>{g}</Tag>
          ))}
          {typeof item.rating === "number" && (
            <Tag color="gold">Rating: {item.rating.toFixed(1)}</Tag>
          )}
        </Space>

        <Divider style={{ margin: "10px 0" }} />

        <Space orientation="vertical" size={8} style={{ width: "100%" }}>
          <Button
            type={fav ? "primary" : "default"}
            icon={fav ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => toggleFavorite(item.key)}
            block
          >
            {fav ? "In favorites" : "Add to favorites"}
          </Button>

          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              My rating:
            </Text>
            <Rate count={10} value={myRating} onChange={(v) => setRating(item.key, v)} allowClear />
          </div>
        </Space>
      </Space>
    </Card>
  );
}
