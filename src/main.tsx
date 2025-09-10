import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CreateExercise from "./CreateExercise";
// import App from './App.tsx'
// import Dashboard from "./Dashboard.tsx";
// import UnitManagement from "./UnitManagement";
// import LessonManagement from "./LessonManagement";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CreateExercise />
    </StrictMode>
);
