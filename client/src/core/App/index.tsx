import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/home";
import { Layout } from "./Layout";
import { Register } from "./Register";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to={"/home"} replace />} />
          {/* <Route path="/auth/login" element={<Login />} /> */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/*" element={<Navigate to="/auth/register" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};