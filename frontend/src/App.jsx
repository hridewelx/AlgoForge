import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticatedUser } from "./authenticationSlicer";
import { useEffect } from "react";
import ProblemSet from "./pages/ProblemSet";
import SolveProblem from "./pages/SolveProblem";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import DSAVisualizer from "./pages/DSAVisualizer";
import Courses from "./pages/Courses";
import OAuthCallback from "./pages/OAuthCallback";

// In your main router configuration
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./components/Admin/Dashboard";
import Questions from "./components/Admin/Questions";
import { ChatAi } from "./components/SolveProblem";
import QuestionCreation from "./components/Admin/QuestionCreation";
import QuestionUpdation from "./components/Admin/QuestionUpdation";
import EditorialManagement from "./components/Admin/EditorialManagement";
import UserManagement from "./components/Admin/UserManagement";
import Analytics from "./components/Admin/Analytics";
import AdminSettings from "./components/Admin/AdminSettings";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state) => state.authentication
  );
  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("User:", user);

  useEffect(() => {
    dispatch(checkAuthenticatedUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage></Homepage>}></Route>
        {/* <Route path="/login" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Login></Login> }></Route> */}
        <Route path="/login" element={<Login></Login>}></Route>
        {/* <Route path="/signup" element={ isAuthenticated ? <Navigate to="/"></Navigate> : <Signup></Signup> }></Route> */}
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/oauth/callback" element={<OAuthCallback />}></Route>
        <Route path="/problemset" element={<ProblemSet></ProblemSet>}></Route>
        <Route path="/visualizer" element={<DSAVisualizer />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route
          path="/algoforge/profile/:username"
          element={<UserProfile></UserProfile>}
        ></Route>
        <Route
          path="/algoforge/:username/settings"
          element={<Settings></Settings>}
        ></Route>

        <Route
          path="/problem/:problemId"
          element={<SolveProblem></SolveProblem>}
        ></Route>

        {/* <Route 
          path="/admin" 
          element={
            isAuthenticated && user?.role === "admin" 
              ? <AdminLayout /> 
              : <Navigate to="/" />
          }
        > */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="questions" element={<Questions />} />
          <Route path="questions/create" element={<QuestionCreation />} />
          <Route
            path="questions/update/:problemId"
            element={<QuestionUpdation />}
          />
          <Route
            path="editorials/:problemId"
            element={<EditorialManagement />}
          />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* <Route path="/admin/questions/create" element={<QuestionCreation />} />  */}

        {/* <Route path="/admin/questions" element={<Questions />} />  */}

        {/* <Route path="/algoforgeai/chat" element={<ChatAi />} /> */}

        {/* <Route path="/Test" element={ <Test/> }></Route> */}

        {/* {console.log(" isAuthenticated", isAuthenticated)} */}
      </Routes>
    </>
  );
}

export default App;
