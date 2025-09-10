import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LessonManagement from "./LessonManagement";
// import App from './App.tsx'
// import Dashboard from "./Dashboard.tsx";
// import UnitManagement from "./UnitManagement";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LessonManagement />
    </StrictMode>
);
