import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Row, Space, Spin, Typography } from "antd";
import { useCatalog } from "../context/CatalogContext";
import { getTitleCardData } from "../api/titleApi";
import TitleCard from "../components/titles/TitleCard";

const { Title, Text } = Typography;

async function mapWithConcurrency(list, limit, mapper) {
  const res = new Array(list.length);
  let idx = 0;

  async function worker() {
    while (idx < list.length) {
      const current = idx++;
      try {
        res[current] = await mapper(list[current], current);
      } catch (e) {
        res[current] = { __error: e };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, list.length) }, worker);
  await Promise.all(workers);
  return res;
}

export default function MyCatalog() {
  const { favorites } = useCatalog();

  const parsed = useMemo(() => {
    return favorites
      .map((k) => {
        const [mediaType, id] = String(k).split(":");
        if (!mediaType || !id) return null;
        return { key: k, mediaType, id };
      })
      .filter(Boolean);
  }, [favorites]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const out = await mapWithConcurrency(parsed, 5, async ({ mediaType, id }) => {
        return await getTitleCardData(mediaType, id);
      });

      const ok = out.filter((x) => x && !x.__error);
      setItems(ok);
    } catch (e) {
      setError(e?.message || "Failed to load catalog");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.join("|")]);

  if (!favorites.length) {
    return (
      <Card>
        <Space orientation="vertical" size={8} style={{ width: "100%" }}>
          <Title level={2} style={{ margin: 0 }}>My Catalog</Title>
          <Text type="secondary">Your favorites list is empty.</Text>
        </Space>
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size={12} style={{ width: "100%" }}>
      <Card>
        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
          <Space wrap style={{ justifyContent: "space-between", width: "100%" }}>
            <Title level={2} style={{ margin: 0 }}>My Catalog</Title>
            <Button onClick={load} disabled={loading}>Refresh</Button>
          </Space>
          <Text type="secondary">Favorites: {favorites.length}</Text>
        </Space>
      </Card>

      {error ? <Alert type="error" title={error} showIcon /> : null}

      {loading ? (
        <Card>
          <Space orientation="vertical" size={12} style={{ width: "100%", alignItems: "center" }}>
            <Spin />
            <Text type="secondary">Loading favorites…</Text>
          </Space>
        </Card>
      ) : (
        <Row gutter={[12, 12]}>
          {items.map((it) => (
            <Col key={it.key} xs={24} sm={12} md={8} lg={6}>
              <TitleCard item={it} />
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}
