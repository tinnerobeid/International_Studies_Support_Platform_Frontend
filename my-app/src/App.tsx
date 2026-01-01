import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing";
import Universities from "./pages/university";

const router = createBrowserRouter(
  [
    { path: "/", element: <Landing /> },
    { path: "/universities", element: <Universities /> },
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
  {
    // Opt into upcoming v7 behaviors to silence future-flag warnings
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
