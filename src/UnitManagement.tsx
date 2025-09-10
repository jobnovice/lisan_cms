import React, { useState } from "react";
import {
    Bell,
    Plus,
    Edit,
    GripVertical,
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

interface SubUnit {
    id: string;
    title: string;
    theme: string;
    order: number;
}

interface Unit {
    id: string;
    title: string;
    subUnits: SubUnit[];
}

interface UnitCardProps {
    unit: Unit;
    onEditUnit: (unitId: string) => void;
    onAddSubUnit: (unitId: string) => void;
    onEditSubUnit: (unitId: string, subUnitId: string) => void;
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

const UnitCard: React.FC<UnitCardProps> = ({
    unit,
    onEditUnit,
    onAddSubUnit,
    onEditSubUnit,
}) => (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm">
        {/* Unit Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400 cursor-grab" size={20} />
                <h2 className="text-gray-800 text-xl font-bold leading-tight">
                    {unit.title}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEditUnit(unit.id)}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md transition-colors"
                    aria-label="Edit unit"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onAddSubUnit(unit.id)}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md transition-colors"
                    aria-label="Add sub-unit"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>

        {/* Sub-units */}
        <div className="divide-y divide-gray-200">
            {unit.subUnits.map((subUnit) => (
                <div
                    key={subUnit.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                    <GripVertical
                        className="text-gray-400 cursor-grab"
                        size={16}
                    />
                    <div className="flex-1">
                        <p className="text-gray-800 text-base font-medium leading-normal">
                            {subUnit.title}
                        </p>
                        <p className="text-gray-500 text-sm font-normal leading-normal">
                            Theme: {subUnit.theme}
                        </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                        Order: {subUnit.order}
                    </span>
                    <button
                        onClick={() => onEditSubUnit(unit.id, subUnit.id)}
                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md transition-colors"
                        aria-label="Edit sub-unit"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

// Main Unit Management Component
const UnitManagement: React.FC = () => {
    // Mock data - in a real app, this would come from props or API calls
    const [units] = useState<Unit[]>([
        {
            id: "1",
            title: "Unit 1: Greetings",
            subUnits: [
                {
                    id: "1-1",
                    title: "Sub-unit 1: Basic Greetings",
                    theme: "Greetings",
                    order: 1,
                },
                {
                    id: "1-2",
                    title: "Sub-unit 2: Formal Greetings",
                    theme: "Greetings",
                    order: 2,
                },
            ],
        },
        {
            id: "2",
            title: "Unit 2: Introductions",
            subUnits: [
                {
                    id: "2-1",
                    title: "Sub-unit 1: Introducing Yourself",
                    theme: "Introductions",
                    order: 1,
                },
                {
                    id: "2-2",
                    title: "Sub-unit 2: Introducing Others",
                    theme: "Introductions",
                    order: 2,
                },
                {
                    id: "2-3",
                    title: "Sub-unit 3: Asking for Names",
                    theme: "Introductions",
                    order: 3,
                },
            ],
        },
        {
            id: "3",
            title: "Unit 3: Basic Phrases",
            subUnits: [
                {
                    id: "3-1",
                    title: "Sub-unit 1: Common Phrases",
                    theme: "Basic Phrases",
                    order: 1,
                },
                {
                    id: "3-2",
                    title: "Sub-unit 2: Polite Phrases",
                    theme: "Basic Phrases",
                    order: 2,
                },
            ],
        },
    ]);

    // Event handlers
    const handleNavClick = (section: string) => {
        console.log(`Navigate to ${section}`);
    };

    const handleNewUnit = () => {
        console.log("Create new unit");
    };

    const handleEditUnit = (unitId: string) => {
        console.log(`Edit unit: ${unitId}`);
    };

    const handleAddSubUnit = (unitId: string) => {
        console.log(`Add sub-unit to unit: ${unitId}`);
    };

    const handleEditSubUnit = (unitId: string, subUnitId: string) => {
        console.log(`Edit sub-unit: ${subUnitId} in unit: ${unitId}`);
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
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-gray-900 text-3xl font-bold leading-tight">
                                    Units & Sub-units
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your Amharic learning units and
                                    organize content
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
                                <button
                                    onClick={handleNewUnit}
                                    className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium leading-normal shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus size={16} />
                                    <span>New Unit</span>
                                </button>
                            </div>
                        </div>

                        {/* Units List */}
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {units.map((unit) => (
                                <UnitCard
                                    key={unit.id}
                                    unit={unit}
                                    onEditUnit={handleEditUnit}
                                    onAddSubUnit={handleAddSubUnit}
                                    onEditSubUnit={handleEditSubUnit}
                                />
                            ))}
                        </div>

                        {/* Empty State (when no units exist) */}
                        {units.length === 0 && (
                            <div className="max-w-5xl mx-auto">
                                <div className="text-center py-12">
                                    <div className="size-16 text-gray-300 mx-auto mb-4">
                                        <svg
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-gray-900 text-lg font-semibold mb-2">
                                        No units yet
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Create your first learning unit to get
                                        started with your Amharic curriculum.
                                    </p>
                                    <button
                                        onClick={handleNewUnit}
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Plus size={16} />
                                        <span>Create First Unit</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Summary Stats */}
                        <div className="max-w-5xl mx-auto mt-12">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Content Summary
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {units.length}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Total Units
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {units.reduce(
                                                (total, unit) =>
                                                    total +
                                                    unit.subUnits.length,
                                                0
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Total Sub-units
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {Math.round(
                                                units.reduce(
                                                    (total, unit) =>
                                                        total +
                                                        unit.subUnits.length,
                                                    0
                                                ) / units.length
                                            ) || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Avg. Sub-units per Unit
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UnitManagement;
