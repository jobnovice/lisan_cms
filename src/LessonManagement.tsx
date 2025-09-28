import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Save, GripVertical, Edit, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from './api';
import type { ApiResponse, Exercise as ApiExercise, Lesson } from './api';

// Enhanced interfaces that extend API types with our custom fields
interface Option {
  id: number;
  text: string;
  option_audio_url?: string;
}

interface Exercise extends ApiExercise {
  // Added custom fields
  instruction: string;
  promptText?: string;
  promptAudio?: string;
  referenceText?: string;
  displayText?: string;
  correctAnswer?: string;
  blocks?: string[];
  options?: Option[];
  correctOptionId?: number;
  hints?: string;
}

// interface LessonData {
//   title: string;
//   orderIndex: number;
//   estimatedTime: number;
//   exercises: Exercise[];
// }

interface ExerciseRowProps {
  exercise: Exercise;
  onEdit: (exerciseId: string) => void;
  onRemove: (exerciseId: string) => void;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({
  exercise,
  onEdit,
  onRemove,
}) => (
  <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 text-center cursor-move">
      <GripVertical className="text-gray-400" size={16} />
    </td>
    <td className="px-6 py-4 font-medium text-gray-900 text-center">
      {exercise.order}
    </td>
    <td className="px-6 py-4 font-medium text-gray-900">
      {exercise.title}
    </td>
    <td className="px-6 py-4 text-gray-600 capitalize">{exercise.type.toLowerCase()}</td>
    <td className="px-6 py-4 text-right">
      <button
        onClick={() => onEdit(exercise.id)}
        className="font-medium text-blue-600 hover:text-blue-800 transition-colors mr-4"
        aria-label={`Edit ${exercise.title}`}
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => onRemove(exercise.id)}
        className="font-medium text-red-600 hover:text-red-800 transition-colors"
        aria-label={`Remove ${exercise.title}`}
      >
        <Trash2 size={18} />
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
  placeholder?: string;
}> = ({ label, type = "text", value, onChange, className = "", placeholder }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-900 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      placeholder={placeholder}
    />
  </div>
);

const LessonManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // FIX: Add lessonId to the state we're receiving
  const { unitId, subUnitId, subUnitTitle, lessonId, lessonTitle } = location.state || {};
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load lesson and exercises from API when component mounts
  useEffect(() => {
    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId]);

  const loadLessonData = async () => {
    setIsLoading(true);
    try {
      // Load lesson details if we have lessonId
      if (lessonId) {
        const lessonResponse: ApiResponse<Lesson> = await apiService.getLesson(lessonId);
        if (lessonResponse.success && lessonResponse.data) {
          setLesson(lessonResponse.data);
        }
      }

      // Load exercises for this lesson from API
      const response: ApiResponse<ApiExercise[]> = await apiService.getExercises(lessonId || subUnitId);
      
      if (response.success && response.data) {
        // Convert API exercises to our enhanced Exercise type
        const enhancedExercises: Exercise[] = response.data.map(apiEx => ({
          ...apiEx,
          instruction: apiEx.instruction || '',
          promptText: apiEx.content?.promptText || '',
          correctAnswer: apiEx.content?.correctAnswer || '',
          hints: apiEx.hints || '',
        }));
        
        setExercises(enhancedExercises);
      }
    } catch (error) {
      console.error('Error loading lesson data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FIX: Proper back navigation with all required state
  const handleBackToSubUnits = () => {
    navigate('/subunit', { 
      state: {
        unitId,
        subUnitId, 
        subUnitTitle
      }
    });
  };

  const handleTitleChange = (title: string) => {
    // If we have a lesson object, update it
    if (lesson) {
      setLesson({ ...lesson, title });
    }
  };

  const handleOrderIndexChange = (orderIndex: string) => {
    if (lesson) {
      setLesson({ ...lesson, order: parseInt(orderIndex) || 0 });
    }
  };

  const handleEstimatedTimeChange = (estimatedTime: string) => {
    if (lesson) {
      setLesson({ ...lesson, estimatedTime: parseInt(estimatedTime) || 0 });
    }
  };

  const handleCreateNew = () => {
    navigate('/create-exercise', {
      state: {
        unitId,
        subUnitId,
        lessonId: lessonId || subUnitId,
        lessonTitle: lesson?.title || lessonTitle || 'New Lesson',
        mode: 'create'
      }
    });
  };

  const handleEditExercise = (exerciseId: string) => {
    const exerciseToEdit = exercises.find(ex => ex.id === exerciseId);
    
    if (!exerciseToEdit) {
      alert("Exercise not found!");
      return;
    }

    navigate('/create-exercise', {
      state: {
        unitId,
        subUnitId,
        lessonId: lessonId || subUnitId,
        lessonTitle: lesson?.title || lessonTitle,
        exerciseId: exerciseToEdit.id,
        exerciseData: exerciseToEdit,
        mode: 'edit'
      }
    });
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    if (window.confirm("Are you sure you want to remove this exercise?")) {
      try {
        const response = await apiService.deleteExercise(exerciseId);
        
        if (response.success) {
          setExercises(exercises.filter((ex) => ex.id !== exerciseId));
          alert("Exercise removed successfully!");
        } else {
          alert(`Error: ${response.error}`);
        }
      } catch (error) {
        alert("Error removing exercise");
        console.error('Error removing exercise:', error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Save lesson metadata if we have a lesson object
      if (lesson && lessonId) {
        const response = await apiService.updateLesson(lessonId, {
          title: lesson.title,
          order: lesson.order,
          estimatedTime: lesson.estimatedTime,
        });
        
        if (response.success) {
          alert("Lesson changes saved successfully!");
        } else {
          alert(`Error saving lesson: ${response.error}`);
        }
      } else {
        alert("Lesson changes saved successfully!");
      }
    } catch (error) {
      alert("Error saving lesson changes");
      console.error('Error saving lesson:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading lesson...</div>
      </div>
    );
  }

  const displayTitle = lesson?.title || lessonTitle || "Untitled Lesson";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen">
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="py-10 px-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <button
                  onClick={handleBackToSubUnits}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Back to Sub-Units
                </button>
                
                {unitId && subUnitTitle && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-blue-700 text-sm">
                      <span className="font-medium">Unit:</span> {unitId} • 
                      <span className="font-medium"> Sub-unit:</span> {subUnitTitle}
                    </p>
                    {lessonId && (
                      <p className="text-blue-600 text-xs mt-1">
                        <span className="font-medium">Lesson ID:</span> {lessonId}
                      </p>
                    )}
                  </div>
                )}
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Edit Lesson: {displayTitle}
                </h2>
                <p className="text-gray-600">
                  Manage the exercises within this lesson.
                  Add, reorder, or configure exercises to
                  create an engaging learning experience.
                  {exercises.length === 0 && (
                    <span className="block mt-2 text-blue-600 font-medium">
                      This lesson is empty. Click "Create New" to add your first exercise.
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Lesson Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Lesson Title"
                    value={lesson?.title || ''}
                    onChange={handleTitleChange}
                    className="md:col-span-3"
                    placeholder="Enter lesson title"
                  />
                  <FormField
                    label="Order Index"
                    type="number"
                    value={lesson?.order || 0}
                    onChange={handleOrderIndexChange}
                    placeholder="0"
                  />
                  <FormField
                    label="Estimated Completion Time (min)"
                    type="number"
                    value={lesson?.estimatedTime || 0}
                    onChange={handleEstimatedTimeChange}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Exercises ({exercises.length})
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateNew}
                      className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                      <span>Create New</span>
                    </button>
                  </div>
                </div>

                {exercises.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 w-16 text-center">Drag</th>
                          <th className="px-6 py-3 w-20 text-center">Order</th>
                          <th className="px-6 py-3">Exercise Title</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercises.map((exercise) => (
                          <ExerciseRow
                            key={exercise.id}
                            exercise={exercise}
                            onEdit={handleEditExercise}
                            onRemove={handleRemoveExercise}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <div className="text-gray-400 mb-4">
                      <Edit size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-2">
                      No exercises yet
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                      Add exercises to this lesson to create an engaging learning experience for your students.
                      Start with vocabulary practice, grammar exercises, or conversation simulations.
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

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleBackToSubUnits}
                  className="flex items-center justify-center rounded-md h-12 px-6 border border-gray-300 text-gray-700 text-base font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-12 px-6 bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors shadow-sm"
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