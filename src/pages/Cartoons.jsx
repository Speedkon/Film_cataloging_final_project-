import React, { useMemo, useState } from "react";
import { Alert, Button, Row, Col, Space } from "antd";
import FiltersBar from "../components/titles/FiltersBar";
import TitleCard from "../components/titles/TitleCard";
import { discoverTitles } from "../api/discoverApi";

const ANIMATION_ID = 16;

export default function Cartoons() {
  const [searchText, setSearchText] = useState("");
  const [year, setYear] = useState(null);
  const [sortKey, setSortKey] = useState("rating_desc");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const viewItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    let arr = q ? items.filter((x) => (x.title || "").toLowerCase().includes(q)) : [...items];

    if (sortKey === "alpha") arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (sortKey === "year_desc") arr.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sortKey === "rating_desc") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return arr;
  }, [items, searchText, sortKey]);

  const apply = async () => {
    setError("");
    setLoading(true);
    setItems([]);
    setPage(1);

    try {
      const res = await discoverTitles({
        mediaType: "movie",
        page: 1,
        genreIds: [ANIMATION_ID],
        year,
      });
      setItems(res.items);
      setPage(2);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setError(e?.message || "Failed to load cartoons");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSearchText("");
    setYear(null);
    setSortKey("rating_desc");
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setError("");
  };

  const loadMore = async () => {
    if (loadingMore) return;
    if (page > totalPages) return;

    setError("");
    setLoadingMore(true);
    try {
      const res = await discoverTitles({
        mediaType: "movie",
        page,
        genreIds: [ANIMATION_ID],
        year,
      });
      setItems((prev) => {
        const map = new Map(prev.map((x) => [x.key, x]));
        res.items.forEach((x) => map.set(x.key, x));
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

  return (
    <Space orientation="vertical" size={12} style={{ width: "100%" }}>
      <FiltersBar
        title="Cartoons (Animation)"
        searchText={searchText}
        onSearchText={setSearchText}
        genreOptions={[{ value: ANIMATION_ID, label: "Animation" }]}
        selectedGenres={[ANIMATION_ID]}
        onSelectedGenres={() => {}}
        year={year}
        onYear={setYear}
        sortKey={sortKey}
        onSortKey={setSortKey}
        onApply={apply}
        onReset={reset}
        genreDisabled
      />

      {error ? <Alert type="error" title={error} showIcon /> : null}

      <Row gutter={[12, 12]}>
        {viewItems.map((it) => (
          <Col key={it.key} xs={24} sm={12} md={8} lg={6}>
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
