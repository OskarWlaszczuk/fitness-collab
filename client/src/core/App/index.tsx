import {  Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/Home";
import { Layout } from "./Layout";
import { Register } from "../../features/public/Register";
import { Login } from "../../features/public/Login";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Chats } from "../../features/Chats";
import { ModeProtectedRoute } from "./routes/ModeProtectedRoute";
import { Workouts } from "../../features/Workouts";
import { WorkoutCreator } from "../../features/WorkoutCreator";
import { Unauthorized } from "../../features/Unauthorized";
import { Missing } from "../../features/public/Missing";
import { useUserApiInterceptors } from "./useUserApiInterceptors";

export const App = () => {
  useUserApiInterceptors();

  return (
    <Routes >
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<>Profile</>} />

          <Route element={<ModeProtectedRoute allowedModes={[1]} />}>
            <Route path="/workouts" element={<Workouts />} />
          </Route>

          <Route element={<ModeProtectedRoute allowedModes={[2]} />}>
            <Route path="/workout-creator" element={<WorkoutCreator />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Route>
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};