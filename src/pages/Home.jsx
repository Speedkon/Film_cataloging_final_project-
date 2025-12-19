import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Input, Row, Col, Select, Space, Typography } from "antd";
import { fetchHomeTitles } from "../api/titlesApi";
import TitleCard from "../components/titles/TitleCard";

const { Title, Text } = Typography;

const SORTS = [
  { value: "alpha", label: "Alphabet (A→Z)" },
  { value: "year_desc", label: "Year (new→old)" },
  { value: "rating_desc", label: "Rating (high→low)" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("rating_desc");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const sortedItems = useMemo(() => {
    const arr = [...items];
    if (sortKey === "alpha") arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (sortKey === "year_desc") arr.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sortKey === "rating_desc") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return arr;
  }, [items, sortKey]);

  const loadFirst = async (q) => {
    setError("");
    setLoading(true);
    setItems([]);
    setPage(1);

    try {
      const res = await fetchHomeTitles({ query: q, page: 1 });
      setItems(res.items);
      setPage(2);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setError(e?.message || "Failed to load titles");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;
    if (page > totalPages) return;

    setError("");
    setLoadingMore(true);
    try {
      const res = await fetchHomeTitles({ query, page });
      setItems((prev) => {
        const map = new Map(prev.map((x) => [x.mediaType + ":" + x.id, x]));
        res.items.forEach((x) => map.set(x.mediaType + ":" + x.id, x));
        return Array.from(map.values());
      });
      setPage((p) => p + 1);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setError(e?.message || "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadFirst("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Title level={2} style={{ margin: 0 }}>Home</Title>
          <Text type="secondary">Trending mixed titles + search</Text>

          <Space wrap style={{ width: "100%", marginTop: 8 }}>
            <Input.Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSearch={(v) => loadFirst(v || "")}
              placeholder="Search movies / TV…"
              allowClear
              style={{ width: 320 }}
            />

            <Select
              value={sortKey}
              onChange={setSortKey}
              options={SORTS}
              style={{ width: 220 }}
            />

            <Button onClick={() => loadFirst("")}>Trending</Button>
          </Space>
        </Space>
      </Card>

      {error ? <Alert type="error" message={error} showIcon /> : null}

      <Row gutter={[12, 12]}>
        {sortedItems.map((it) => (
          <Col key={`${it.mediaType}:${it.id}`} xs={24} sm={12} md={8} lg={6}>
            <TitleCard item={it} />
          </Col>
        ))}
      </Row>

      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 20px" }}>
        <Button
          type="primary"
          loading={loading || loadingMore}
          disabled={page > totalPages}
          onClick={loadMore}
        >
          Load more
        </Button>
      </div>
    </Space>
  );
}
