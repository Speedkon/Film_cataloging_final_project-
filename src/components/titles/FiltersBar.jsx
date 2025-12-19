import React from "react";
import { Card, Space, Select, Input, Button, Typography } from "antd";

const { Text } = Typography;

export default function FiltersBar({
  title,
  searchText,
  onSearchText,
  genreOptions,
  selectedGenres,
  onSelectedGenres,
  year,
  onYear,
  sortKey,
  onSortKey,
  onApply,
  onReset,
  genreDisabled = false,
}) {
  return (
    <Card>
      <Space orientation="vertical" size={10} style={{ width: "100%" }}>
        <Space wrap align="center" style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong style={{ fontSize: 18 }}>{title}</Text>
          <Space>
            <Button onClick={onReset}>Reset</Button>
            <Button type="primary" onClick={onApply}>Apply</Button>
          </Space>
        </Space>

        <Space wrap style={{ width: "100%" }}>
          <Input
            value={searchText}
            onChange={(e) => onSearchText(e.target.value)}
            placeholder="Search in loaded results…"
            allowClear
            style={{ width: 260 }}
          />

          <Select
            mode="multiple"
            allowClear
            disabled={genreDisabled}
            placeholder="Genre"
            value={selectedGenres}
            onChange={onSelectedGenres}
            options={genreOptions}
            style={{ width: 260 }}
          />

          <Select
            allowClear
            placeholder="Year"
            value={year}
            onChange={onYear}
            options={makeYearOptions()}
            style={{ width: 140 }}
          />

          <Select
            value={sortKey}
            onChange={onSortKey}
            options={[
              { value: "alpha", label: "Alphabet (A→Z)" },
              { value: "year_desc", label: "Year (new→old)" },
              { value: "rating_desc", label: "Rating (high→low)" },
            ]}
            style={{ width: 220 }}
          />
        </Space>
      </Space>
    </Card>
  );
}

function makeYearOptions() {
  const current = new Date().getFullYear();
  const start = 1950;
  const opts = [];
  for (let y = current; y >= start; y--) {
    opts.push({ value: y, label: String(y) });
  }
  return opts;
}
