import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UnitManagement from "./UnitManagement";
// import App from './App.tsx'
// import Dashboard from "./Dashboard.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <UnitManagement />
    </StrictMode>
);
