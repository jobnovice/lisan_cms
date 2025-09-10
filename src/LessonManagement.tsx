import React, { useState } from "react";
import {
    ArrowLeft,
    Plus,
    Save,
    GripVertical,
    Edit,
    BarChart3,
    FolderOpen,
    Users,
    Settings,
    HelpCircle,
} from "lucide-react";

// TypeScript interfaces
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface Exercise {
    id: string;
    order: number;
    title: string;
    type: "Vocabulary" | "Grammar" | "Conversation" | "Listening" | "Writing";
}

interface LessonData {
    title: string;
    orderIndex: number;
    estimatedTime: number;
    exercises: Exercise[];
}

interface ExerciseRowProps {
    exercise: Exercise;
    onEdit: (exerciseId: string) => void;
    onRemove: (exerciseId: string) => void;
}

// Components
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

const ExerciseRow: React.FC<ExerciseRowProps> = ({
    exercise,
    onEdit,
    onRemove,
}) => (
    <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-center cursor-move">
            <GripVertical className="text-gray-400" size={16} />
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">
            {exercise.order}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">
            {exercise.title}
        </td>
        <td className="px-6 py-4 text-gray-600">{exercise.type}</td>
        <td className="px-6 py-4 text-right">
            <button
                onClick={() => onEdit(exercise.id)}
                className="font-medium text-blue-600 hover:underline mr-4 transition-colors"
            >
                Edit
            </button>
            <button
                onClick={() => onRemove(exercise.id)}
                className="font-medium text-red-600 hover:underline transition-colors"
            >
                Remove
            </button>
        </td>
    </tr>
);

const FormField: React.FC<{
    label: string;
    type?: string;
    value: string | number;
    onChange: (value: string) => void;
    className?: string;
}> = ({ label, type = "text", value, onChange, className = "" }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
    </div>
);

// Main Edit Lesson Component
const LessonManagement: React.FC = () => {
    // State for lesson data
    const [lessonData, setLessonData] = useState<LessonData>({
        title: "Introduction to Amharic",
        orderIndex: 1,
        estimatedTime: 25,
        exercises: [
            {
                id: "1",
                order: 1,
                title: "Greetings and Introductions",
                type: "Vocabulary",
            },
            { id: "2", order: 2, title: "Basic Phrases", type: "Grammar" },
            {
                id: "3",
                order: 3,
                title: "Common Expressions",
                type: "Conversation",
            },
        ],
    });

    // Event handlers
    const handleNavClick = (section: string) => {
        console.log(`Navigate to ${section}`);
    };

    const handleBackToLessons = () => {
        console.log("Navigate back to lessons list");
    };

    const handleTitleChange = (title: string) => {
        setLessonData((prev) => ({ ...prev, title }));
    };

    const handleOrderIndexChange = (orderIndex: string) => {
        setLessonData((prev) => ({
            ...prev,
            orderIndex: parseInt(orderIndex) || 0,
        }));
    };

    const handleEstimatedTimeChange = (estimatedTime: string) => {
        setLessonData((prev) => ({
            ...prev,
            estimatedTime: parseInt(estimatedTime) || 0,
        }));
    };

    const handleAddExisting = () => {
        console.log("Add existing exercise");
    };

    const handleCreateNew = () => {
        console.log("Create new exercise");
    };

    const handleEditExercise = (exerciseId: string) => {
        console.log(`Edit exercise: ${exerciseId}`);
    };

    const handleRemoveExercise = (exerciseId: string) => {
        setLessonData((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
        }));
    };

    const handleSaveChanges = () => {
        console.log("Save lesson changes:", lessonData);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200">
                        <div className="flex items-center gap-3 text-gray-800">
                            <h1 className="text-gray-900 text-lg font-bold">
                                Lisan CMS
                            </h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <NavItem
                            icon={<BarChart3 size={20} />}
                            label="Dashboard"
                            onClick={() => handleNavClick("dashboard")}
                        />
                        <NavItem
                            icon={<FolderOpen size={20} />}
                            label="Content"
                            isActive={true}
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

                    {/* User Profile Section */}
                    <div className="px-6 py-5 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    CA
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Content Author
                                </p>
                                <button className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                                    View profile
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="py-10 px-12">
                        <div className="max-w-5xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <button
                                    onClick={handleBackToLessons}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Lessons
                                </button>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Edit Lesson: {lessonData.title}
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Manage the exercises within this lesson.
                                    Add, reorder, or configure exercises to
                                    create an engaging learning experience.
                                </p>
                            </div>

                            {/* Lesson Metadata */}
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Lesson Metadata
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        label="Lesson Title"
                                        value={lessonData.title}
                                        onChange={handleTitleChange}
                                        className="md:col-span-3"
                                    />
                                    <FormField
                                        label="Order Index"
                                        type="number"
                                        value={lessonData.orderIndex}
                                        onChange={handleOrderIndexChange}
                                    />
                                    <FormField
                                        label="Estimated Completion Time (min)"
                                        type="number"
                                        value={lessonData.estimatedTime}
                                        onChange={handleEstimatedTimeChange}
                                    />
                                </div>
                            </div>

                            {/* Exercises Section */}
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Exercises
                                    </h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddExisting}
                                            className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            <Plus size={16} />
                                            <span>Add Existing</span>
                                        </button>
                                        <button
                                            onClick={handleCreateNew}
                                            className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus size={16} />
                                            <span>Create New</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Exercises Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 w-16"
                                                ></th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 w-20"
                                                >
                                                    Order
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Exercise Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lessonData.exercises.map(
                                                (exercise) => (
                                                    <ExerciseRow
                                                        key={exercise.id}
                                                        exercise={exercise}
                                                        onEdit={
                                                            handleEditExercise
                                                        }
                                                        onRemove={
                                                            handleRemoveExercise
                                                        }
                                                    />
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {lessonData.exercises.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Edit
                                                size={48}
                                                className="mx-auto"
                                            />
                                        </div>
                                        <h3 className="text-gray-900 text-lg font-semibold mb-2">
                                            No exercises yet
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Add exercises to this lesson to
                                            create an engaging learning
                                            experience.
                                        </p>
                                        <button
                                            onClick={handleCreateNew}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus size={16} />
                                            <span>Create First Exercise</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveChanges}
                                    className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-12 px-6 bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Save size={16} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LessonManagement;
