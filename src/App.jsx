import { Routes, Route } from "react-router";
import "./App.css";
import Sidebar from "./layouts/Sidebar";
import Dashboard from "./pages/Dashboard";
import Construction from "./pages/Construction";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="cash" element={<Construction />} />
          <Route path="etf" element={<Construction />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
