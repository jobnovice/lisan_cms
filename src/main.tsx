// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Dashboard from "./Dashboard";
import UnitManagement from "./UnitManagement";
import LessonManagement from "./LessonManagement";
import CreateExercise from "./CreateExercise";
import Layout from "./Layout";
//import PlaceholderPage from "./PlaceholderPage"; // Add this import

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: "/units",
    element: <Layout><UnitManagement /></Layout>,
  },
  {
    path: "/lessons", 
    element: <Layout><LessonManagement /></Layout>,
  },
  {
    path: "/create-exercise",
    element: <CreateExercise />,
  }
	//   },
//   // Add these temporary routes:
//   {
//     path: "/settings",
//     element: <Layout><PlaceholderPage title="Settings" /></Layout>,
//   },
//   {
//     path: "/help",
//     element: <Layout><PlaceholderPage title="Help" /></Layout>,
//   },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);