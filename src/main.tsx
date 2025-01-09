import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import ListingPage from "./pages/ListingPage";
import FarcasterJson from "./pages/FarcasterJson.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/listings/:listingId",
    element: <ListingPage />,
  },
  {
    path: ".well-known/farcaster.json",
    loader: () => {
      return new Response(JSON.stringify(FarcasterJson), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
