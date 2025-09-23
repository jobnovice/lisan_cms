// src/Layout.tsx
import React from "react";
import { BarChart3, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-gray-900 text-lg font-bold">Lisan CMS</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard Link - goes to "/" */}
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Content/Units Link - goes to "/units" */}
            <Link
              to="/units"
              className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors ${
                isActive("/units")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FolderOpen size={20} />
              <span className="text-sm font-medium">Content</span>
            </Link>

            {/* Settings Link - goes to "/settings" */}
            {/* <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors ${
                isActive("/settings")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </Link> */}

            {/* Help Link - goes to "/help" */}
            {/* <Link
              to="/help"
              className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors ${
                isActive("/help")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <HelpCircle size={20} />
              <span className="text-sm font-medium">Help</span>
            </Link> */}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;