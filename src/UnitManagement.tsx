import React, { useState, useEffect } from "react";
import { Plus, Edit, GripVertical, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from './api';
import type { Unit, SubUnit, ApiResponse } from './api';

interface UnitCardProps {
	unit: Unit;
	onEditUnit: (unit: Unit) => void;
	onAddSubUnit: (unitId: string) => void;
	onEditSubUnit: (unitId: string, subUnit: SubUnit) => void;
	onViewLessons: (unitId: string, subUnitId: string, subUnitTitle: string) => void;
}

// Modal Components
const UnitFormModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { title: string; description?: string }) => void;
	editingUnit?: Unit | null;
}> = ({ isOpen, onClose, onSubmit, editingUnit }) => {
	const [title, setTitle] = useState(editingUnit?.title || "");
	const [description, setDescription] = useState(editingUnit?.description || "");

	useEffect(() => {
		if (editingUnit) {
			setTitle(editingUnit.title);
			setDescription(editingUnit.description || "");
		}
	}, [editingUnit]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ title, description });
		setTitle("");
		setDescription("");
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
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description (Optional)
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Brief description of this unit"
							rows={3}
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
	existingOrders?: number[];
}> = ({ isOpen, onClose, onSubmit, editingSubUnit, existingOrders = [] }) => {
	const [title, setTitle] = useState("");
	const [theme, setTheme] = useState("");
	const [order, setOrder] = useState("1");
	const [orderError, setOrderError] = useState("");

	useEffect(() => {
		if (editingSubUnit) {
			// Extract title part before colon
			const titleParts = editingSubUnit.title.split(':');
			setTitle(titleParts[0]?.trim() || '');
			setTheme(editingSubUnit.theme);
			setOrder(editingSubUnit.order.toString());
		} else {
			// Suggest next available order for new sub-units
			const nextOrder = existingOrders.length > 0 
				? (Math.max(...existingOrders) + 1).toString() 
				: "1";
			setOrder(nextOrder);
		}
		setOrderError("");
	}, [editingSubUnit, existingOrders]);

	const validateOrder = (orderValue: string): boolean => {
		const orderNum = parseInt(orderValue);
		if (isNaN(orderNum) || orderNum < 1) {
			setOrderError("Order must be a positive number");
			return false;
		}
		if (existingOrders.includes(orderNum) && (!editingSubUnit || editingSubUnit.order !== orderNum)) {
			setOrderError(`Order ${orderNum} is already used`);
			return false;
		}
		setOrderError("");
		return true;
	};

	const handleOrderChange = (value: string) => {
		setOrder(value);
		validateOrder(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateOrder(order)) {
			return;
		}

		onSubmit({ 
			title, 
			theme, 
			order: parseInt(order) || 1 
		});
		setTitle("");
		setTheme("");
		setOrder("1");
		setOrderError("");
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
							Order {existingOrders.length > 0 && 
								<span className="text-xs text-gray-500 ml-2">
									(Available: {getAvailableOrders(existingOrders).join(', ')})
								</span>
							}
						</label>
						<input
							type="number"
							value={order}
							onChange={(e) => handleOrderChange(e.target.value)}
							className={`w-full p-2 border rounded-md ${
								orderError ? 'border-red-300 bg-red-50' : 'border-gray-300'
							}`}
							min="1"
							required
						/>
						{orderError && (
							<p className="text-red-500 text-xs mt-1">{orderError}</p>
						)}
						{!orderError && existingOrders.length > 0 && (
							<p className="text-green-600 text-xs mt-1">
								✓ Order {order} is available
							</p>
						)}
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
							disabled={!!orderError}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{editingSubUnit ? "Update Sub-unit" : "Add Sub-unit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Helper function to get available order numbers
const getAvailableOrders = (existingOrders: number[]): number[] => {
	const maxOrder = Math.max(0, ...existingOrders);
	const available = [];
	for (let i = 1; i <= maxOrder + 1; i++) {
		if (!existingOrders.includes(i)) {
			available.push(i);
		}
	}
	return available.slice(0, 5); // Show next 5 available orders
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
				<div>
					<h2 className="text-gray-800 text-xl font-bold leading-tight">
						{unit.title}
					</h2>
					{unit.description && (
						<p className="text-gray-600 text-sm mt-1">{unit.description}</p>
					)}
					<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
						<span>Order: {unit.order}</span>
						<span className={`px-2 py-1 rounded-full ${
							unit.isPublished 
								? 'bg-green-100 text-green-800' 
								: 'bg-yellow-100 text-yellow-800'
						}`}>
							{unit.isPublished ? 'Published' : 'Draft'}
						</span>
						<span>Created: {new Date(unit.createdAt).toLocaleDateString()}</span>
						<span>Sub-units: {unit.subUnits.length}</span>
					</div>
				</div>
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
						onClick={() => onViewLessons(unit.id, subUnit.id, subUnit.title)}
					>
						<p className="text-gray-800 text-base font-medium leading-normal group-hover:text-blue-600">
							{subUnit.title}
						</p>
						<p className="text-gray-500 text-sm font-normal leading-normal">
							Theme: {subUnit.theme} • Order: {subUnit.order}
						</p>
					</div>
					
					<button
						onClick={() => onViewLessons(unit.id, subUnit.id, subUnit.title)}
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
			
			{unit.subUnits.length === 0 && (
				<div className="p-4 text-center text-gray-500">
					No sub-units yet. Click the + button to add one.
				</div>
			)}
		</div>
	</div>
);

// Main Unit Management Component
const UnitManagement: React.FC = () => {
	const navigate = useNavigate();
	const [units, setUnits] = useState<Unit[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modal states
	const [showUnitModal, setShowUnitModal] = useState(false);
	const [showSubUnitModal, setShowSubUnitModal] = useState(false);
	const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
	const [editingSubUnit, setEditingSubUnit] = useState<SubUnit | null>(null);
	const [currentUnitId, setCurrentUnitId] = useState<string>("");

	// Load units from API
	useEffect(() => {
		loadUnits();
	}, []);

	const loadUnits = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response: ApiResponse<Unit[]> = await apiService.getUnits();

			if (response.success) {
				const unitsWithSubUnits = await Promise.all(
					(response.data || []).map(async (unit) => ({
						...unit,
						subUnits: await loadSubUnitsForUnit(unit.id)
					}))
				);
				setUnits(unitsWithSubUnits);
			} else {
				setError(response.error || 'Failed to load units');
			}
		} catch (err) {
			setError('Network error loading units');
			console.error('Error loading units:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const loadSubUnitsForUnit = async (unitId: string): Promise<SubUnit[]> => {
		try {
			const response: ApiResponse<SubUnit[]> = await apiService.getSubUnits(unitId);
			return response.success ? response.data || [] : [];
		} catch (err) {
			console.error('Error loading subUnits:', err);
			return [];
		}
	};

	// Event handlers
	const handleNewUnit = () => {
		setEditingUnit(null);
		setShowUnitModal(true);
	};

	const handleEditUnit = (unit: Unit) => {
		setEditingUnit(unit);
		setShowUnitModal(true);
	};

	const handleAddSubUnit = async (unitId: string) => {
		setCurrentUnitId(unitId);
		setEditingSubUnit(null);
		setShowSubUnitModal(true);
	};

	const handleEditSubUnit = async (unitId: string, subUnit: SubUnit) => {
		setCurrentUnitId(unitId);
		setEditingSubUnit(subUnit);
		setShowSubUnitModal(true);
	};

	const handleViewLessons = (unitId: string, subUnitId: string, subUnitTitle: string) => {
		navigate('/subunit', {
			state: {
				unitId,
				subUnitId,
				subUnitTitle
			}
		});
	};

	const handleUnitSubmit = async (data: { title: string; description?: string }) => {
		try {
			if (editingUnit) {
				const response: ApiResponse<Unit> = await apiService.updateUnit(editingUnit.id, {
					title: data.title,
					description: data.description
				});

				if (response.success) {
					await loadUnits();
					alert('Unit updated successfully!');
				} else {
					alert(`Error: ${response.error}`);
				}
			} else {
				const response: ApiResponse<Unit> = await apiService.createUnit({
					title: data.title,
					description: data.description || "",
					order: units.length + 1,
					isPublished: false,
					subUnits: []
				});

				if (response.success) {
					await loadUnits();
					alert('Unit created successfully!');
				} else {
					alert(`Error: ${response.error}`);
				}
			}
		} catch (err) {
			alert('Error saving unit');
			console.error('Error saving unit:', err);
		}
	};

	const handleSubUnitSubmit = async (data: { title: string; theme: string; order: number }) => {
		try {
			const existingSubUnits = units.find(u => u.id === currentUnitId)?.subUnits || [];
			const orderExists = existingSubUnits.some(subUnit => 
				subUnit.order === data.order && 
				(!editingSubUnit || subUnit.id !== editingSubUnit.id)
			);

			if (orderExists) {
				alert(`Error: Order number ${data.order} is already used. Please choose a different order.`);
				return;
			}

			if (editingSubUnit) {
				const fullTitle = `${data.title}: ${data.theme}`;
				const response = await apiService.updateSubUnit(editingSubUnit.id, {
					title: fullTitle,
					order: data.order,
					estimatedTotalTime: editingSubUnit.estimatedTotalTime,
					theme: data.theme
				});

				if (response.success) {
					await loadUnits();
					alert('Sub-unit updated successfully!');
				} else {
					alert(`Error: ${response.error}`);
				}
			} else {
				const fullTitle = `${data.title}: ${data.theme}`;
				const response = await apiService.createSubUnit({
					title: fullTitle,
					order: data.order,
					unitId: currentUnitId,
					estimatedTotalTime: 0,
					theme: data.theme
				});

				if (response.success) {
					await loadUnits();
					alert('Sub-unit created successfully!');
				} else {
					alert(`Error: ${response.error}`);
				}
			}
		} catch (err) {
			alert('Error saving sub-unit');
			console.error('Error saving sub-unit:', err);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-lg">Loading units...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-red-600">Error: {error}</div>
				<button
					onClick={loadUnits}
					className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 font-sans">
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
				existingOrders={units.find(u => u.id === currentUnitId)?.subUnits.map(s => s.order) || []}
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
									onClick={handleNewUnit}
									className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium leading-normal shadow-sm hover:bg-blue-700 transition-colors"
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
										<BookOpen size={64} className="mx-auto" />
									</div>
									<h3 className="text-gray-900 text-lg font-semibold mb-2">No units yet</h3>
									<p className="text-gray-600 text-sm mb-4">
										Create your first learning unit to get started with your Amharic curriculum.
									</p>
									<button
										onClick={handleNewUnit}
										className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
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
											{units.length > 0 ? Math.round(units.reduce((total, unit) => total + unit.subUnits.length, 0) / units.length) : 0}
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