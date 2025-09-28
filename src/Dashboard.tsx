// dashboard.tsx
import React, { useState, useEffect } from "react";
import { Bell, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from './api';
import type { ApiResponse, Unit, SubUnit, Lesson, Exercise } from './api';

interface StatCardProps {
    title: string;
    value: number;
    bgColor?: string;
    loading?: boolean;
}

interface ContentStats {
    units: number;
    lessons: number;
    exercises: number;
    subUnits: number;
}

interface ContentStatus {
    draft: number;
    published: number;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    bgColor = "bg-white",
    loading = false,
}) => (
    <div
        className={`p-6 ${bgColor} border border-gray-200 rounded-lg shadow-sm`}
    >
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
            <div className="flex items-center mt-2">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading...</span>
            </div>
        ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        )}
    </div>
);

const ActionButton: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    disabled?: boolean;
}> = ({ children, variant = "primary", onClick, disabled = false }) => {
    const baseClasses =
        "flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-md h-10 px-4 text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
        >
            {children}
        </button>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [contentStats, setContentStats] = useState<ContentStats>({
        units: 0,
        subUnits: 0,
        lessons: 0,
        exercises: 0,
    });

    const [contentStatus, setContentStatus] = useState<ContentStatus>({
        draft: 0,
        published: 0,
    });

    const [recentActivity, setRecentActivity] = useState<Array<{
        id: string;
        title: string;
        type: 'unit' | 'subUnit' | 'lesson' | 'exercise';
        action: 'created' | 'updated' | 'published';
        timestamp: string;
    }>>([]);

    // Fetch all data from the API
    const fetchDashboardData = async (isRefreshing = false) => {
        if (isRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            // Fetch all units to get counts and status
            const unitsResponse: ApiResponse<Unit[]> = await apiService.getUnits();
            
            if (!unitsResponse.success) {
                throw new Error(unitsResponse.error || 'Failed to fetch units');
            }

            const units = unitsResponse.data || [];
            
            // Fetch all sub-units, lessons, and exercises to get accuratee counts
            let allSubUnits: SubUnit[] = [];
            let allLessons: Lesson[] = [];
            let allExercises: Exercise[] = [];

            // Get all sub-units for each unit
            for (const unit of units) {
                const subUnitsResponse = await apiService.getSubUnits(unit.id);
                if (subUnitsResponse.success && subUnitsResponse.data) {
                    allSubUnits = [...allSubUnits, ...subUnitsResponse.data];
                    
                    // Get all lessons for each sub-unit
                    for (const subUnit of subUnitsResponse.data) {
                        const lessonsResponse = await apiService.getLessons(subUnit.id);
                        if (lessonsResponse.success && lessonsResponse.data) {
                            allLessons = [...allLessons, ...lessonsResponse.data];
                            
                            // Get all exercises for each lesson
                            for (const lesson of lessonsResponse.data) {
                                const exercisesResponse = await apiService.getExercises(lesson.id);
                                if (exercisesResponse.success && exercisesResponse.data) {
                                    allExercises = [...allExercises, ...exercisesResponse.data];
                                }
                            }
                        }
                    }
                }
            }

            // Calculate stats
            const stats: ContentStats = {
                units: units.length,
                subUnits: allSubUnits.length,
                lessons: allLessons.length,
                exercises: allExercises.length,
            };

            // Calculate status (using isPublished field from units as example)
            const status: ContentStatus = {
                published: units.filter(unit => unit.isPublished).length,
                draft: units.filter(unit => !unit.isPublished).length,
            };

            // Generate recent activity from the most recently updated items
            const activities = [
                ...units.map(unit => ({
                    id: unit.id,
                    title: unit.title,
                    type: 'unit' as const,
                    action: unit.isPublished ? 'published' as const : 'updated' as const,
                    timestamp: unit.updatedAt,
                })),
                ...allSubUnits.map(subUnit => ({
                    id: subUnit.id,
                    title: subUnit.title,
                    type: 'subUnit' as const,
                    action: 'updated' as const,
                    timestamp: subUnit.updatedAt,
                })),
                ...allLessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    type: 'lesson' as const,
                    action: 'updated' as const,
                    timestamp: lesson.updatedAt,
                })),
                ...allExercises.map(exercise => ({
                    id: exercise.id,
                    title: exercise.title,
                    type: 'exercise' as const,
                    action: 'updated' as const,
                    timestamp: exercise.updatedAt,
                })),
            ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
             .slice(0, 5); // Top 5 most recent

            setContentStats(stats);
            setContentStatus(status);
            setRecentActivity(activities);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCreateUnit = () => {
        navigate('/units');
    };

    const handleRefresh = () => {
        fetchDashboardData(true);
    };

    const handleNotificationClick = () => {
        console.log("Open notifications");
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    const getActivityIcon = (type: string, action: string) => {
        if (action === 'published') return 'bg-green-500';
        if (action === 'created') return 'bg-blue-500';
        return 'bg-yellow-500';
    };

    const getActivityText = (title: string, type: string, action: string) => {
        const typeMap = {
            unit: 'Unit',
            subUnit: 'Sub-unit',
            lesson: 'Lesson',
            exercise: 'Exercise'
        };
        
        const actionMap = {
            created: 'was created',
            updated: 'was updated',
            published: 'was published'
        };

        return (
            <span className="text-sm text-gray-700">
                <span className="font-medium">{typeMap[type as keyof typeof typeMap]}: {title}</span> {actionMap[action as keyof typeof actionMap]}
            </span>
        );
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
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                    title="Refresh data"
                                >
                                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
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

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                                <p className="text-red-800">Error: {error}</p>
                                <button
                                    onClick={() => fetchDashboardData()}
                                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Content Overview
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Units"
                                    value={contentStats.units}
                                    loading={loading}
                                />
                                <StatCard
                                    title="Sub-units"
                                    value={contentStats.subUnits}
                                    loading={loading}
                                />
                                <StatCard
                                    title="Lessons"
                                    value={contentStats.lessons}
                                    loading={loading}
                                />
                                <StatCard
                                    title="Exercises"
                                    value={contentStats.exercises}
                                    loading={loading}
                                />
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Content Status
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                <StatCard
                                    title="Published Units"
                                    value={contentStatus.published}
                                    loading={loading}
                                    bgColor="bg-green-50"
                                />
                                <StatCard
                                    title="Draft Units"
                                    value={contentStatus.draft}
                                    loading={loading}
                                    bgColor="bg-yellow-50"
                                />
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Quick Actions
                            </h2>
                            <div className="flex gap-4 flex-wrap">
                                <ActionButton onClick={handleCreateUnit} disabled={loading}>
                                    <Plus size={16} />
                                    <span>Create Unit</span>
                                </ActionButton>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Recent Activity
                            </h2>
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <RefreshCw size={24} className="animate-spin text-gray-400" />
                                    </div>
                                ) : recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={activity.id} className={`flex items-center gap-3 ${index < recentActivity.length - 1 ? 'pb-3 border-b border-gray-100' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type, activity.action)}`}></div>
                                                {getActivityText(activity.title, activity.type, activity.action)}
                                                <span className="text-xs text-gray-500 ml-auto">
                                                    {formatTimeAgo(activity.timestamp)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No recent activity. Create your first unit to get started!
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;	