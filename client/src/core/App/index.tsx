import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../../features/Home";
import { Layout } from "./Layout";
import { Register } from "../../features/Register";
import { Login } from "../../features/Login";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Chats } from "../../features/Chats";
import { ModeProtectedRoute } from "./routes/ModeProtectedRoute";
import { Workouts } from "../../features/Workouts";
import { WorkoutCreator } from "../../features/WorkoutCreator";
import { Unauthorized } from "../../features/Unauthorized";
import { Missing } from "../../features/Missing";
import { useUserApiInterceptors } from "./useUserApiInterceptors";

export const App = () => {
  useUserApiInterceptors();

  return (
    <BrowserRouter basename="/fitness-collab" >
      <Route path="/" element={<Navigate to="/fitness-collab/home" replace />} />
      <Routes >
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
    </BrowserRouter>
  );
};







// return (
//   <Routes>
//     <Route path="/auth">
//       <Route path="/auth/login" element={<Login />} />
//       <Route path="/auth/register" element={<Register />} />
//     </Route>

//     <Route path="/" element={<Layout />} >
//       {
//         //ścieżki login i register nie dostępne jeżeli !!accessToken
//       }
//       {/* <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} /> */}
//       <Route path="/unathorized" element={<Unathorized />} />

//       <Route element={<RequireAuth allowedModes={[1, 2]} />}>
//         <Route path="/home" element={<Home />} />
//         <Route path="/chats" element={<Chats />} />
//         <Route path="/profile" element={<>Profile</>} />
//       </Route>

//       <Route element={<RequireAuth allowedModes={[1]} />}>
//         <Route path="/workouts" element={<>workouts</>} />
//         <Route path="/trainers" element={<>trainers</>} />
//         <Route path="/excersise" element={<>excersise</>} />
//       </Route>

//       <Route element={<RequireAuth allowedModes={[2]} />}>
//         <Route path="/workout-creator" element={<>workout creator</>} />
//       </Route>

//       <Route path="*" element={<Missing />} />
//     </Route>
//   </Routes>
// );