import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing";
import Universities from "./pages/university";
import Scholarships from "./pages/scholarship";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/universities", element: <Universities /> },
  { path: "/scholarships", element: <Scholarships /> },
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
