import React from "react";
import {
    Bell,
    Plus,
    PlusCircle,
    BarChart3,
    FolderOpen,
    Settings,
    HelpCircle,
} from "lucide-react";

// TypeScript interfaces
interface StatCardProps {
    title: string;
    value: number;
    bgColor?: string;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface ContentStats {
    units: number;
    lessons: number;
    exercises: number;
}

interface ContentStatus {
    draft: number;
    inReview: number;
    published: number;
}

// Components
const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    bgColor = "bg-white",
}) => (
    <div
        className={`p-6 ${bgColor} border border-gray-200 rounded-lg shadow-sm`}
    >
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

const NavItem: React.FC<NavItemProps> = ({
    icon,
    label,
    isActive = false,
    onClick,
}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors ${
            isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
        }`}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const ActionButton: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
}> = ({ children, variant = "primary", onClick }) => {
    const baseClasses =
        "flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-md h-10 px-4 text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses}`}
        >
            {children}
        </button>
    );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
    // Mock data - in a real app, this would come from props or API calls
    const contentStats: ContentStats = {
        units: 12,
        lessons: 48,
        exercises: 120,
    };

    const contentStatus: ContentStatus = {
        draft: 3,
        inReview: 5,
        published: 10,
    };

    // Event handlers
    const handleNavClick = (section: string) => {
        console.log(`Navigate to ${section}`);
    };

    const handleCreateUnit = () => {
        console.log("Create new unit");
    };

    const handleCreateLesson = () => {
        console.log("Create new lesson");
    };

    const handleNotificationClick = () => {
        console.log("Open notifications");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200">
                        <h1 className="text-gray-900 text-lg font-bold">
                            Lisan CMS
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <NavItem
                            icon={<BarChart3 size={20} />}
                            label="Dashboard"
                            isActive={true}
                            onClick={() => handleNavClick("dashboard")}
                        />
                        <NavItem
                            icon={<FolderOpen size={20} />}
                            label="Content"
                            onClick={() => handleNavClick("content")}
                        />
                        <NavItem
                            icon={<Settings size={20} />}
                            label="Settings"
                            onClick={() => handleNavClick("settings")}
                        />
                        <NavItem
                            icon={<HelpCircle size={20} />}
                            label="Help"
                            onClick={() => handleNavClick("help")}
                        />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="p-8">
                        {/* Header */}
                        <header className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Welcome to Lisan Amharic Learning CMS
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleNotificationClick}
                                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} className="text-gray-600" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        A
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Content Overview Section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Content Overview
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <StatCard
                                    title="Units"
                                    value={contentStats.units}
                                />
                                <StatCard
                                    title="Lessons"
                                    value={contentStats.lessons}
                                />
                                <StatCard
                                    title="Exercises"
                                    value={contentStats.exercises}
                                />
                            </div>
                        </section>

                        {/* Content Status Section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Content Status
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <StatCard
                                    title="Draft"
                                    value={contentStatus.draft}
                                />
                                <StatCard
                                    title="Published"
                                    value={contentStatus.published}
                                />
                            </div>
                        </section>

                        {/* Quick Actions Section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Quick Actions
                            </h2>
                            <div className="flex gap-4 flex-wrap">
                                <ActionButton onClick={handleCreateUnit}>
                                    <Plus size={16} />
                                    <span>Create Unit</span>
                                </ActionButton>
                                <ActionButton
                                    variant="secondary"
                                    onClick={handleCreateLesson}
                                >
                                    <PlusCircle size={16} />
                                    <span>Create Lesson</span>
                                </ActionButton>
                            </div>
                        </section>

                        {/* Recent Activity Section */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Recent Activity
                            </h2>
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Unit 5: Greetings
                                            </span>{" "}
                                            was published
                                        </p>
                                        <span className="text-xs text-gray-500 ml-auto">
                                            2 hours ago
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Lesson 12: Numbers 1-10
                                            </span>{" "}
                                            is in review
                                        </p>
                                        <span className="text-xs text-gray-500 ml-auto">
                                            5 hours ago
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Exercise: Pronunciation Practice
                                            </span>{" "}
                                            draft created
                                        </p>
                                        <span className="text-xs text-gray-500 ml-auto">
                                            1 day ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
