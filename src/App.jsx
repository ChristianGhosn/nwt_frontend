import { Routes, Route } from "react-router";
import "./App.css";
import LayoutMain from "./layouts/LayoutMain";
import Dashboard from "./pages/Dashboard";
import Construction from "./pages/Construction";
import NotFound from "./pages/NotFound";
import Cash from "./pages/Cash";
import ETFs from "./pages/ETFs";

function App() {
  return (
    <>
      <Routes>
        <Route element={<LayoutMain />}>
          <Route index element={<Dashboard />} />
          <Route path="cash" element={<Cash />} />
          <Route path="etf" element={<ETFs />} />
          <Route path="stocks" element={<Construction />} />
          <Route path="managed-funds" element={<Construction />} />
          <Route path="crypto" element={<Construction />} />
          <Route path="dividends" element={<Construction />} />
          <Route path="liabilities" element={<Construction />} />
          <Route path="fire" element={<Construction />} />
          <Route path="super" element={<Construction />} />
          <Route path="budget" element={<Construction />} />
          <Route path="settings" element={<Construction />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
