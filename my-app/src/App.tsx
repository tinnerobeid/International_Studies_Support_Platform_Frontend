import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing";
import Universities from "./pages/university";
import Scholarships from "./pages/scholarship";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminProgramsListPage from "./pages/adminprogramlist";
import AdminProgramCreatePage from "./pages/adminprogramcreatepage";
import StudentProfilePage from "./pages/studentpageprofile";
import UniversityProfilePage from "./pages/universityprofilepage";
import ScholarshipPageProfile from "./pages/scholarshipprofile";
import ApplicationsListPage from "./pages/applicationlist";
import ApplicationCreatePage from "./pages/applicationcreate";
import ApplicationDetailPage from "./pages/applicationdetails";

import AdminApplicationsListPage from "./pages/adminapplicationlist";
import AdminApplicationDetailPage from "./pages/adminapplicationdetails";

import NotificationsPage from "./pages/notifications";



const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/universities", element: <Universities /> },
  { path: "/scholarships", element: <Scholarships /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/admin/programs", element: <AdminProgramsListPage /> },
  { path: "/admin/programs/create", element: <AdminProgramCreatePage /> },
  { path: "/profile", element: <StudentProfilePage /> },
  { path: "/universities/:id", element: <UniversityProfilePage /> },
  { path: "/admin/programs/new", element: <AdminProgramCreatePage /> },
  { path: "/scholarships/:id", element: <ScholarshipPageProfile /> },
  { path: "/applications", element: <ApplicationsListPage /> },
  { path: "/applications/new", element: <ApplicationCreatePage /> },
  { path: "/applications/:id", element: <ApplicationDetailPage /> },

  { path: "/admin/applications", element: <AdminApplicationsListPage /> },
  { path: "/admin/applications/:id", element: <AdminApplicationDetailPage /> },
  { path: "/notifications", element: <NotificationsPage /> },

  {
    path: "*",
    element: (
      <div style={{ padding: 24 }}>
        <h1>404</h1>
        <p>Page not found.</p>
      </div>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
