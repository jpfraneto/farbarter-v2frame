import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import App from "./App";
import "./index.css";
import ListingPage from "./pages/ListingPage";
import FarcasterJson from "../public/.well-known/farcaster.json";
import FarcasterProvider from "./components/providers/FarcasterProvider";

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

function Root() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return (
    <React.StrictMode>
      <FarcasterProvider>
        <RouterProvider router={router} />
      </FarcasterProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
