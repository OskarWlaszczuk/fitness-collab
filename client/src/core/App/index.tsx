import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/home";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to={"/home"} replace />} />
      </Routes>
    </HashRouter>
  );
};