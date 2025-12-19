import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Row, Space, Spin, Tag, Typography, Rate, Divider } from "antd";
import { getTitleDetailsWithCredits } from "../api/titleApi";
import { useCatalog } from "../context/CatalogContext";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function TitleDetails() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite, getRating, setRating } = useCatalog();

  const itemKey = `${mediaType}:${id}`;
  const fav = isFavorite(itemKey);
  const myRating = getRating(itemKey);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setData(null);

    getTitleDetailsWithCredits(mediaType, id)
      .then((res) => {
        if (!alive) return;
        setData(res);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load details");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [mediaType, id]);

  const castText = useMemo(() => {
    if (!data?.cast?.length) return "—";
    return data.cast
      .slice(0, 12)
      .map((p) => p?.name)
      .filter(Boolean)
      .join(", ");
  }, [data]);

  if (loading) {
    return (
      <Card>
        <Space orientation="vertical" size={12} style={{ width: "100%", alignItems: "center" }}>
          <Spin />
          <Text type="secondary">Loading…</Text>
        </Space>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
          <Alert type="error" title={error} showIcon />
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card>
      <Space orientation="vertical" size={14} style={{ width: "100%" }}>
        <Space wrap style={{ justifyContent: "space-between", width: "100%" }}>
          <Button onClick={() => navigate(-1)}>Back</Button>

          <Space>
            <Button
              type={fav ? "primary" : "default"}
              icon={fav ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => toggleFavorite(itemKey)}
            >
              {fav ? "In favorites" : "Add to favorites"}
            </Button>

            <Space>
              <Text type="secondary">My rating:</Text>
              <Rate count={10} value={myRating} onChange={(v) => setRating(itemKey, v)} allowClear />
            </Space>
          </Space>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ width: "100%", aspectRatio: "2 / 3", background: "#111", overflow: "hidden" }}>
              {data.posterUrl ? (
                <img
                  src={data.posterUrl}
                  alt={data.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ color: "#fff", padding: 12 }}>No poster</div>
              )}
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              <Title level={2} style={{ margin: 0 }}>
                {data.title}
              </Title>

              <Space wrap>
                {typeof data.year === "number" && <Tag>{data.year}</Tag>}
                {data.genres.map((g) => (
                  <Tag key={g}>{g}</Tag>
                ))}
                {typeof data.rating === "number" && (
                  <Tag color="gold">Rating: {data.rating.toFixed(1)}</Tag>
                )}
              </Space>

              <Space wrap>
                <Text type="secondary">
                  Type: <b>{mediaType}</b>
                </Text>

                {mediaType === "movie" && data.runtime ? (
                  <Text type="secondary">
                    Runtime: <b>{data.runtime} min</b>
                  </Text>
                ) : null}

                {mediaType === "tv" && (data.seasons || data.episodes) ? (
                  <Text type="secondary">
                    Seasons: <b>{data.seasons || "—"}</b>, Episodes: <b>{data.episodes || "—"}</b>
                  </Text>
                ) : null}
              </Space>

              <Divider style={{ margin: "10px 0" }} />

              <div>
                <Text strong>Description</Text>
                <Paragraph style={{ marginTop: 6 }}>
                  {data.overview ? data.overview : "—"}
                </Paragraph>
              </div>

              <div>
                <Text strong>Cast</Text>
                <Paragraph style={{ marginTop: 6 }}>{castText}</Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
