import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/modeProtected/shared/Home";
import { Layout } from "./Layout";
import { Register } from "../../features/public/Register";
import { Login } from "../../features/public/Login";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Chats } from "../../features/modeProtected/shared/Chats";
import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { WorkoutPlans } from "../../features/modeProtected/trainee/WorkoutPlans";
import { WorkoutCreator } from "../../features/modeProtected/trainer/WorkoutCreator";
import { Unauthorized } from "../../features/modeProtected/shared/Unauthorized";
import { Missing } from "../../features/public/Missing";
import { useUserApiInterceptors } from "./useUserApiInterceptors";
import { TrainerProfile } from "../../features/modeProtected/shared/TrainerProfile";
import { Workout } from "../../features/modeProtected/trainee/Workout"
import { ExcersiseLog } from "../../features/modeProtected/trainee/ExcersiseLog";
import { ExcersiseLogEntries } from "../../features/modeProtected/trainee/ExcersiseLogEntries";

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
          <Route path="/trainers/:id" element={<TrainerProfile />} />

          <Route element={<RoleProtectedRoute allowedRoles={[1]} />}>
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/workout-plan-day/:id" element={<Workout />} />
            <Route path="/excersise-log" element={<ExcersiseLog />} />
            <Route path="/excersise-log-entries/:id" element={<ExcersiseLogEntries />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={[2]} />}>
            <Route path="/workout-creator" element={<WorkoutCreator />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Route>
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};