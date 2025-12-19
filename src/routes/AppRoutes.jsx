import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Series from "../pages/Series";
import Cartoons from "../pages/Cartoons";
import TitleDetails from "../pages/TitleDetails";
import MyCatalog from "../pages/MyCatalog";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/series" element={<Series />} />
      <Route path="/cartoons" element={<Cartoons />} />
      <Route path="/catalog" element={<MyCatalog />} />
      <Route path="/title/:id" element={<TitleDetails />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
