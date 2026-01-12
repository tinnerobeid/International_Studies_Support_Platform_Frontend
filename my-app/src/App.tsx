import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

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
import AdminDashboardPage from "./pages/admindashboard";

import RequireRole from "./components/requirerole";
import AppNav from "./components/appnav";

function Layout() {
  return (
    <>
      <AppNav />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      { path: "/universities", element: <Universities /> },
      { path: "/universities/:id", element: <UniversityProfilePage /> },

      { path: "/scholarships", element: <Scholarships /> },
      { path: "/scholarships/:id", element: <ScholarshipPageProfile /> },

      {
        path: "/applications",
        element: (
          <RequireRole allow={["student"]}>
            <ApplicationsListPage />
          </RequireRole>
        ),
      },
      {
        path: "/applications/new",
        element: (
          <RequireRole allow={["student"]}>
            <ApplicationCreatePage />
          </RequireRole>
        ),
      },
      {
        path: "/applications/:id",
        element: (
          <RequireRole allow={["student"]}>
            <ApplicationDetailPage />
          </RequireRole>
        ),
      },

      // 🔒 Account (Student)
      {
        path: "/profile",
        element: (
          <RequireRole allow={["student"]}>
            <StudentProfilePage />
          </RequireRole>
        ),
      },


      {
        path: "/notifications",
        element: (
          <RequireRole allow={["student", "university"]}>
            <NotificationsPage />
          </RequireRole>
        ),
      },

      // 🔒 University/Admin-only
      {
        path: "/admin/dashboard",
        element: (
          <RequireRole allow={["university"]}>
            <AdminDashboardPage />
          </RequireRole>
        ),
      },
      {
        path: "/admin/programs",
        element: (
          <RequireRole allow={["university"]}>
            <AdminProgramsListPage />
          </RequireRole>
        ),
      },
      {
        path: "/admin/programs/create",
        element: (
          <RequireRole allow={["university"]}>
            <AdminProgramCreatePage />
          </RequireRole>
        ),
      },
      {
        path: "/admin/programs/new",
        element: (
          <RequireRole allow={["university"]}>
            <AdminProgramCreatePage />
          </RequireRole>
        ),
      },
      {
        path: "/admin/applications",
        element: (
          <RequireRole allow={["university"]}>
            <AdminApplicationsListPage />
          </RequireRole>
        ),
      },
      {
        path: "/admin/applications/:id",
        element: (
          <RequireRole allow={["university"]}>
            <AdminApplicationDetailPage />
          </RequireRole>
        ),
      },

      // Optional: If dashboard should be public, remove RequireRole wrapper
      {
        path: "/dashboard",
        element: (
          <RequireRole allow={["student"]}>
            <Dashboard />
          </RequireRole>
        ),
      },

      // 404
      {
        path: "*",
        element: (
          <div style={{ padding: 24 }}>
            <h1>404</h1>
            <p>Page not found.</p>
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
