import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ConvertPage from "./pages/ConvertPage";
import DiscoverPage from "./pages/DiscoverPage";
import OntologyPage from "./pages/OntologyPage";
import VisualizePage from "./pages/VisualizePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ConvertPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="ontology" element={<OntologyPage />} />
        <Route path="visualize" element={<VisualizePage />} />
      </Route>
    </Routes>
  );
}
