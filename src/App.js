import React from "react";
import { HashRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import { CatalogProvider } from "./context/CatalogContext";

export default function App() {
  return (
    <CatalogProvider>
      <HashRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </HashRouter>
    </CatalogProvider>
  );
}
