import React, { useState } from "react";
import { ArrowLeft, Plus, Save, GripVertical, Edit, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface Option {
  id: number;
  text: string;
  option_audio_url?: string;
}

interface Exercise {
  id: string;
  order: number;
  title: string;
  type: "Vocabulary" | "Grammar" | "Conversation" | "Listening" | "Writing";
  instruction?: string;
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
  
  const { unitId, subUnitId, subUnitTitle } = location.state || {};
  
  const [lessonData, setLessonData] = useState<LessonData>({
    title: subUnitTitle || "Introduction to Amharic",
    orderIndex: 1,
    estimatedTime: 25,
    exercises: [
      {
        id: "ex1",
        order: 1,
        title: "Basic Greetings Practice",
        type: "Vocabulary",
        instruction: "Translate the English phrases to Amharic",
        promptText: "Hello, how are you?",
        correctAnswer: "ሰላም፣ እንዴት ነህ?",
        hints: "Remember formal vs informal greetings"
      },
      {
        id: "ex2", 
        order: 2,
        title: "Formal Introductions",
        type: "Conversation",
        instruction: "Complete the introduction",
        displayText: "ስሜ ____ ነው።",
        correctAnswer: "ስሜ ዮሃንስ ነው።",
        hints: "Use your name in the blank"
      },
      {
        id: "ex3",
        order: 3,
        title: "Numbers Quiz",
        type: "Grammar", 
        instruction: "Choose the correct number",
        displayText: "What is five in Amharic?",
        options: [
          { id: 0, text: "አምስት" },
          { id: 1, text: "ስድስት" },
          { id: 2, text: "ሰባት" }
        ],
        correctOptionId: 0,
        hints: "Think of the Amharic number system"
      }
    ],
  });

  const handleBackToUnits = () => {
    navigate('/units', { state: { unitId } });
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

  const handleCreateNew = () => {
    navigate('/create-exercise', {
      state: {
        unitId,
        subUnitId,
        lessonId: "current-lesson-id",
        lessonTitle: lessonData.title,
        mode: 'create'
      }
    });
  };

  const handleEditExercise = (exerciseId: string) => {
    const exerciseToEdit = lessonData.exercises.find(ex => ex.id === exerciseId);
    
    if (!exerciseToEdit) {
      alert("Exercise not found!");
      return;
    }

    navigate('/create-exercise', {
      state: {
        unitId,
        subUnitId,
        lessonId: "current-lesson-id",
        lessonTitle: lessonData.title,
        exerciseId: exerciseToEdit.id,
        exerciseData: exerciseToEdit,
        mode: 'edit'
      }
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (window.confirm("Are you sure you want to remove this exercise?")) {
      setLessonData((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
      }));
    }
  };

  const handleSaveChanges = () => {
    console.log("Save lesson changes:", lessonData);
    console.log("Context:", { unitId, subUnitId, subUnitTitle });
    alert("Lesson changes saved successfully!");
  };

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
                
                {unitId && subUnitTitle && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-blue-700 text-sm">
                      <span className="font-medium">Unit:</span> {unitId} • 
                      <span className="font-medium"> Sub-unit:</span> {subUnitTitle}
                    </p>
                  </div>
                )}
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Edit Lesson: {lessonData.title}
                </h2>
                <p className="text-gray-600">
                  Manage the exercises within this lesson.
                  Add, reorder, or configure exercises to
                  create an engaging learning experience.
                </p>
              </div>

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
                    placeholder="Enter lesson title"
                  />
                  <FormField
                    label="Order Index"
                    type="number"
                    value={lessonData.orderIndex}
                    onChange={handleOrderIndexChange}
                    placeholder="0"
                  />
                  <FormField
                    label="Estimated Completion Time (min)"
                    type="number"
                    value={lessonData.estimatedTime}
                    onChange={handleEstimatedTimeChange}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Exercises ({lessonData.exercises.length})
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

                {lessonData.exercises.length > 0 ? (
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
                        {lessonData.exercises.map((exercise) => (
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
                  onClick={handleBackToUnits}
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