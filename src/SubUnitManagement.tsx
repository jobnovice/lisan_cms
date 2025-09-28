import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Save, GripVertical, Edit, Trash2, BookOpen, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from './api';
import type { ApiResponse, Lesson as ApiLesson, SubUnit } from './api';

interface LessonData {
  title: string;
  order: number;
  estimatedTime: number;
  objectives: string[];
}

interface LessonRowProps {
  lesson: ApiLesson;
  onEdit: (lessonId: string) => void;
  onManageExercises: (lessonId: string) => void;
  onRemove: (lessonId: string) => void;
}

const LessonRow: React.FC<LessonRowProps> = ({
  lesson,
  onEdit,
  onManageExercises,
  onRemove,
}) => (
  <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 text-center cursor-move">
      <GripVertical className="text-gray-400" size={16} />
    </td>
    <td className="px-6 py-4 font-medium text-gray-900 text-center">
      {lesson.order}
    </td>
    <td className="px-6 py-4 font-medium text-gray-900">
      {lesson.title}
    </td>
    <td className="px-6 py-4 text-gray-600">{lesson.estimatedTime} min</td>
    <td className="px-6 py-4">
      <div className="flex flex-wrap gap-1">
        {lesson.objectives.slice(0, 2).map((obj, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {obj}
          </span>
        ))}
        {lesson.objectives.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            +{lesson.objectives.length - 2} more
          </span>
        )}
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <button
        onClick={() => onManageExercises(lesson.id)}
        className="font-medium text-green-600 hover:text-green-800 transition-colors mr-3"
        aria-label={`Manage exercises for ${lesson.title}`}
        title="Manage Exercises"
      >
        <BookOpen size={18} />
      </button>
      <button
        onClick={() => onEdit(lesson.id)}
        className="font-medium text-blue-600 hover:text-blue-800 transition-colors mr-3"
        aria-label={`Edit ${lesson.title}`}
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => onRemove(lesson.id)}
        className="font-medium text-red-600 hover:text-red-800 transition-colors"
        aria-label={`Remove ${lesson.title}`}
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

const LessonFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonData) => void;
  editingLesson?: ApiLesson | null;
  existingOrders?: number[];
}> = ({ isOpen, onClose, onSubmit, editingLesson, existingOrders = [] }) => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState("30");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (editingLesson) {
      setTitle(editingLesson.title);
      setOrder(editingLesson.order.toString());
      setEstimatedTime(editingLesson.estimatedTime.toString());
      setObjectives(editingLesson.objectives.length > 0 ? editingLesson.objectives : [""]);
    } else {
      const nextOrder = existingOrders.length > 0 
        ? (Math.max(...existingOrders) + 1).toString() 
        : "1";
      setOrder(nextOrder);
      setTitle("");
      setEstimatedTime("30");
      setObjectives([""]);
    }
    setOrderError("");
  }, [editingLesson, existingOrders]);

  const validateOrder = (orderValue: string): boolean => {
    const orderNum = parseInt(orderValue);
    if (isNaN(orderNum) || orderNum < 1) {
      setOrderError("Order must be a positive number");
      return false;
    }
    if (existingOrders.includes(orderNum) && (!editingLesson || editingLesson.order !== orderNum)) {
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

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOrder(order)) {
      return;
    }

    onSubmit({
      title,
      order: parseInt(order),
      estimatedTime: parseInt(estimatedTime),
      objectives: objectives.filter(obj => obj.trim())
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingLesson ? "Edit Lesson" : "Add Lesson"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Basic Greetings"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                orderError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              min="1"
              required
            />
            {orderError && <p className="text-red-500 text-xs mt-1">{orderError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Learning Objectives
              </label>
              <button
                type="button"
                onClick={addObjective}
                className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
              >
                <Plus size={14} />
                <span>Add Objective</span>
              </button>
            </div>
            {objectives.map((objective, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Objective ${index + 1}`}
                />
                {objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={!!orderError}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              <span>{editingLesson ? "Update Lesson" : "Add Lesson"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function (same as in UnitManagement)
const getAvailableOrders = (existingOrders: number[]): number[] => {
  const maxOrder = Math.max(0, ...existingOrders);
  const available = [];
  for (let i = 1; i <= maxOrder + 1; i++) {
    if (!existingOrders.includes(i)) {
      available.push(i);
    }
  }
  return available.slice(0, 5);
};

const SubUnitManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { unitId, subUnitId, subUnitTitle } = location.state || {};
  
  const [subUnit, setSubUnit] = useState<SubUnit | null>(null);
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ApiLesson | null>(null);

  useEffect(() => {
    if (subUnitId) {
      loadSubUnitData();
    }
  }, [subUnitId]);

  const loadSubUnitData = async () => {
    setIsLoading(true);
    try {
      // Load sub-unit details
      const subUnitResponse: ApiResponse<SubUnit> = await apiService.getSubUnit(subUnitId);
      if (subUnitResponse.success && subUnitResponse.data) {
        setSubUnit(subUnitResponse.data);
      }

      // Load lessons for this sub-unit
      const lessonsResponse: ApiResponse<ApiLesson[]> = await apiService.getLessons(subUnitId);
      if (lessonsResponse.success && lessonsResponse.data) {
        setLessons(lessonsResponse.data);
      }
    } catch (error) {
      console.error('Error loading sub-unit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUnits = () => {
    navigate('/units');
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    setShowLessonModal(true);
  };

  const handleEditLesson = (lessonId: string) => {
    const lessonToEdit = lessons.find(lesson => lesson.id === lessonId);
    if (lessonToEdit) {
      setEditingLesson(lessonToEdit);
      setShowLessonModal(true);
    }
  };

  const handleManageExercises = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    navigate('/lessons', {
      state: {
        unitId,
        subUnitId,
        subUnitTitle: subUnit?.title || subUnitTitle,
        lessonId,
        lessonTitle: lesson?.title
      }
    });
  };

  const handleRemoveLesson = async (lessonId: string) => {
    if (window.confirm("Are you sure you want to remove this lesson?")) {
      try {
        const response = await apiService.deleteLesson(lessonId);
        if (response.success) {
          setLessons(lessons.filter(lesson => lesson.id !== lessonId));
          alert("Lesson removed successfully!");
        } else {
          alert(`Error: ${response.error}`);
        }
      } catch (error) {
        alert("Error removing lesson");
        console.error('Error removing lesson:', error);
      }
    }
  };

  const handleLessonSubmit = async (lessonData: LessonData) => {
    try {
      if (editingLesson) {
        const response = await apiService.updateLesson(editingLesson.id, {
          ...lessonData,
          unitId: unitId!,
          subUnitId: subUnitId!,
        });
        
        if (response.success) {
          await loadSubUnitData();
          alert('Lesson updated successfully!');
        }
      } else {
        const response = await apiService.createLesson({
          ...lessonData,
          unitId: unitId!,
          subUnitId: subUnitId!,
        });
        
        if (response.success) {
          await loadSubUnitData();
          alert('Lesson created successfully!');
        }
      }
    } catch (error) {
      alert('Error saving lesson');
      console.error('Error saving lesson:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading sub-unit data...</div>
      </div>
    );
  }

  if (!subUnit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Sub-unit not found</div>
      </div>
    );
  }

  const existingOrders = lessons.map(lesson => lesson.order);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="py-10 px-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <button
                  onClick={handleBackToUnits}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Back to Units
                </button>
                
                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-blue-700 text-sm">
                    <span className="font-medium">Unit:</span> {unitId} • 
                    <span className="font-medium"> Sub-unit:</span> {subUnit.title}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Theme: {subUnit.theme} • Estimated Time: {subUnit.estimatedTotalTime} min
                  </p>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Manage Sub-Unit: {subUnit.title}
                </h2>
                <p className="text-gray-600">
                  Add and manage lessons for this sub-unit. Each lesson can contain multiple exercises.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Lessons ({lessons.length})
                  </h3>
                  <button
                    onClick={handleAddLesson}
                    className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                    <span>Add Lesson</span>
                  </button>
                </div>

                {lessons.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 w-16 text-center">Drag</th>
                          <th className="px-6 py-3 w-20 text-center">Order</th>
                          <th className="px-6 py-3">Lesson Title</th>
                          <th className="px-6 py-3">Time</th>
                          <th className="px-6 py-3">Objectives</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessons.map((lesson) => (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            onEdit={handleEditLesson}
                            onManageExercises={handleManageExercises}
                            onRemove={handleRemoveLesson}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <div className="text-gray-400 mb-4">
                      <BookOpen size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">
                      No lessons yet
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                      Add lessons to this sub-unit to organize your teaching content.
                      Each lesson can contain multiple exercises for students to practice.
                    </p>
                    <button
                      onClick={handleAddLesson}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add First Lesson</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <LessonFormModal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        onSubmit={handleLessonSubmit}
        editingLesson={editingLesson}
        existingOrders={existingOrders}
      />
    </div>
  );
};

export default SubUnitManagement;