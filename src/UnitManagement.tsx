import React, { useState } from "react";
import { Bell, Plus, Edit, GripVertical, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TypeScript interfaces
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
    onEditUnit: (unit: Unit) => void;
    onAddSubUnit: (unitId: string) => void;
    onEditSubUnit: (unitId: string, subUnit: SubUnit) => void;
    onViewLessons: (unitId: string, subUnitId: string) => void;
}

// Modal Components
const UnitFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string }) => void;
    editingUnit?: Unit | null;
}> = ({ isOpen, onClose, onSubmit, editingUnit }) => {
    const [title, setTitle] = useState(editingUnit?.title || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title });
        setTitle("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {editingUnit ? "Edit Unit" : "Create New Unit"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Unit 1: Greetings"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {editingUnit ? "Update Unit" : "Create Unit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SubUnitFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; theme: string; order: number }) => void;
    editingSubUnit?: SubUnit | null;
}> = ({ isOpen, onClose, onSubmit, editingSubUnit }) => {
    const [title, setTitle] = useState(editingSubUnit?.title || "");
    const [theme, setTheme] = useState(editingSubUnit?.theme || "");
    const [order, setOrder] = useState(editingSubUnit?.order.toString() || "1");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            title, 
            theme, 
            order: parseInt(order) || 1 
        });
        setTitle("");
        setTheme("");
        setOrder("1");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {editingSubUnit ? "Edit Sub-unit" : "Add Sub-unit"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub-unit Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Basic Greetings"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Theme
                        </label>
                        <input
                            type="text"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Greetings"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Order
                        </label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="1"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {editingSubUnit ? "Update Sub-unit" : "Add Sub-unit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Unit Card Component
const UnitCard: React.FC<UnitCardProps> = ({
    unit,
    onEditUnit,
    onAddSubUnit,
    onEditSubUnit,
    onViewLessons,
}) => (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400 cursor-grab" size={20} />
                <h2 className="text-gray-800 text-xl font-bold leading-tight">
                    {unit.title}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEditUnit(unit)}
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

        <div className="divide-y divide-gray-200">
            {unit.subUnits.map((subUnit) => (
                <div
                    key={subUnit.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                >
                    <GripVertical className="text-gray-400 cursor-grab" size={16} />
                    
                    <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => onViewLessons(unit.id, subUnit.id)}
                    >
                        <p className="text-gray-800 text-base font-medium leading-normal group-hover:text-blue-600">
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
                        onClick={() => onViewLessons(unit.id, subUnit.id)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md transition-colors"
                        aria-label="Manage lessons"
                        title="Manage Lessons"
                    >
                        <BookOpen size={16} />
                    </button>
                    
                    <button
                        onClick={() => onEditSubUnit(unit.id, subUnit)}
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
    const navigate = useNavigate();
    const [units, setUnits] = useState<Unit[]>([
        {
            id: "1",
            title: "Unit 1: Greetings",
            subUnits: [
                { id: "1-1", title: "Sub-unit 1: Basic Greetings", theme: "Greetings", order: 1 },
                { id: "1-2", title: "Sub-unit 2: Formal Greetings", theme: "Greetings", order: 2 },
            ],
        },
        {
            id: "2",
            title: "Unit 2: Introductions",
            subUnits: [
                { id: "2-1", title: "Sub-unit 1: Introducing Yourself", theme: "Introductions", order: 1 },
                { id: "2-2", title: "Sub-unit 2: Introducing Others", theme: "Introductions", order: 2 },
                { id: "2-3", title: "Sub-unit 3: Asking for Names", theme: "Introductions", order: 3 },
            ],
        },
    ]);

    // Modal states
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showSubUnitModal, setShowSubUnitModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [editingSubUnit, setEditingSubUnit] = useState<SubUnit | null>(null);
    const [currentUnitId, setCurrentUnitId] = useState<string>("");

    // Event handlers
    const handleNewUnit = () => {
        setEditingUnit(null);
        setShowUnitModal(true);
    };

    const handleEditUnit = (unit: Unit) => {
        setEditingUnit(unit);
        setShowUnitModal(true);
    };

    const handleAddSubUnit = (unitId: string) => {
        setCurrentUnitId(unitId);
        setEditingSubUnit(null);
        setShowSubUnitModal(true);
    };

    const handleEditSubUnit = (unitId: string, subUnit: SubUnit) => {
        setCurrentUnitId(unitId);
        setEditingSubUnit(subUnit);
        setShowSubUnitModal(true);
    };

    const handleViewLessons = (unitId: string, subUnitId: string) => {
        navigate('/lessons', { 
            state: { 
                unitId,
                subUnitId,
                subUnitTitle: units.find(u => u.id === unitId)?.subUnits.find(s => s.id === subUnitId)?.title
            } 
        });
    };

    const handleUnitSubmit = (data: { title: string }) => {
        if (editingUnit) {
            // Update existing unit
            setUnits(prev => prev.map(unit => 
                unit.id === editingUnit.id 
                    ? { ...unit, title: data.title }
                    : unit
            ));
        } else {
            // Create new unit
            const newUnit: Unit = {
                id: Date.now().toString(),
                title: data.title,
                subUnits: []
            };
            setUnits(prev => [...prev, newUnit]);
        }
    };

    const handleSubUnitSubmit = (data: { title: string; theme: string; order: number }) => {
        if (editingSubUnit) {
            // Update existing sub-unit
            setUnits(prev => prev.map(unit => 
                unit.id === currentUnitId
                    ? {
                        ...unit,
                        subUnits: unit.subUnits.map(subUnit =>
                            subUnit.id === editingSubUnit.id
                                ? { ...subUnit, ...data }
                                : subUnit
                        )
                    }
                    : unit
            ));
        } else {
            // Create new sub-unit
            const newSubUnit: SubUnit = {
                id: Date.now().toString(),
                title: data.title,
                theme: data.theme,
                order: data.order
            };
            setUnits(prev => prev.map(unit =>
                unit.id === currentUnitId
                    ? { ...unit, subUnits: [...unit.subUnits, newSubUnit] }
                    : unit
            ));
        }
    };

    const handleNotificationClick = () => {
        console.log("Open notifications");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Modals */}
            <UnitFormModal
                isOpen={showUnitModal}
                onClose={() => setShowUnitModal(false)}
                onSubmit={handleUnitSubmit}
                editingUnit={editingUnit}
            />
            <SubUnitFormModal
                isOpen={showSubUnitModal}
                onClose={() => setShowSubUnitModal(false)}
                onSubmit={handleSubUnitSubmit}
                editingSubUnit={editingSubUnit}
            />

            <div className="flex h-screen">
                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-gray-900 text-3xl font-bold leading-tight">
                                    Units & Sub-units
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your Amharic learning units and organize content. 
                                    Click on any sub-unit to manage its lessons.
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

                        <div className="space-y-6 max-w-5xl mx-auto">
                            {units.map((unit) => (
                                <UnitCard
                                    key={unit.id}
                                    unit={unit}
                                    onEditUnit={handleEditUnit}
                                    onAddSubUnit={handleAddSubUnit}
                                    onEditSubUnit={handleEditSubUnit}
                                    onViewLessons={handleViewLessons}
                                />
                            ))}
                        </div>

                        {units.length === 0 && (
                            <div className="max-w-5xl mx-auto">
                                <div className="text-center py-12">
                                    <div className="size-16 text-gray-300 mx-auto mb-4">
                                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h3 className="text-gray-900 text-lg font-semibold mb-2">No units yet</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Create your first learning unit to get started with your Amharic curriculum.
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

                        <div className="max-w-5xl mx-auto mt-12">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{units.length}</div>
                                        <div className="text-sm text-gray-600">Total Units</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {units.reduce((total, unit) => total + unit.subUnits.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Sub-units</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {Math.round(units.reduce((total, unit) => total + unit.subUnits.length, 0) / units.length) || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Avg. Sub-units per Unit</div>
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