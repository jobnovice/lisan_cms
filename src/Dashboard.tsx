import React from "react";
import { Bell, Plus } from "lucide-react";  //, PlusCircle, BookOpen: in case we need some sort of 
import { useNavigate } from "react-router-dom";

interface StatCardProps {
    title: string;
    value: number;
    bgColor?: string;
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

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

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

    const handleCreateUnit = () => {
        navigate('/units');
    };

    // const handleCreateLesson = () => {
    //     navigate('/units');
    // };

    // const handleManageLessons = () => {
    //     navigate('/lessons');
    // };

    const handleNotificationClick = () => {
        console.log("Open notifications");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="flex h-screen">
                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="p-8">
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

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Quick Actions
                            </h2>
                            <div className="flex gap-4 flex-wrap">
                                <ActionButton onClick={handleCreateUnit}>
                                    <Plus size={16} />
                                    <span>Create Unit</span>
                                </ActionButton>
                                {/* <ActionButton
                                    variant="secondary"
                                    onClick={handleCreateLesson}
                                >
                                    <PlusCircle size={16} />
                                    <span>Create Lesson</span>
                                </ActionButton>
                                <ActionButton
                                    variant="secondary"
                                    onClick={handleManageLessons}
                                >
                                    <BookOpen size={16} />
                                    <span>Manage Lessons</span>
                                </ActionButton> */}
                            </div>
                        </section>

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