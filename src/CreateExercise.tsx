/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiService } from './api';
import type { ApiResponse, Exercise as ApiExercise } from './api';
import { useValidation } from './hooks/useValidation';
import { ValidatedField } from './ValidatedField';
import { BlockManager } from './BlockManager';
import { OptionManager } from './OptionManager';
import { AudioPlayer } from './AudioPlayer';
import { EdgeTTS } from "edge-tts-universal";

interface Option {
  id: number;
  text: string;
  option_audio_url?: string;
}

interface ExerciseFormData extends Omit<ApiExercise, 'id' | 'createdAt' | 'updatedAt' | 'content'> {
  promptText?: string;
  promptAudio?: string;
  referenceText?: string;
  displayText?: string;
  correctAnswer?: string;
  blocks?: string[];
  options?: Option[];
  correctOptionId: number;
  hints?: string;
}

export default function CreateExercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonTitle, unitId, subUnitId, lessonId, exerciseId, exerciseData, mode } = location.state || {};
  const isEditMode = mode === 'edit';

  // Initialize validation hook
  const { errors, validateRequired, validateNumber, setError, clearError, clearAllErrors } = useValidation();

  // Form state
  const [formData, setFormData] = useState<ExerciseFormData>({
    unitId: unitId || '',
    subUnitId: subUnitId || '',
    lessonId: lessonId || '',
    title: isEditMode ? exerciseData?.title || '' : '',
    order: isEditMode ? exerciseData?.order || 0 : 0,
    type: isEditMode ? exerciseData?.type || '' : '' as any,
    instruction: isEditMode ? exerciseData?.instruction || '' : '',
    hints: isEditMode ? exerciseData?.hints || '' : '',
    promptText: isEditMode ? exerciseData?.promptText || '' : '',
    promptAudio: isEditMode ? exerciseData?.promptAudio || '' : '',
    referenceText: isEditMode ? exerciseData?.referenceText || '' : '',
    displayText: isEditMode ? exerciseData?.displayText || '' : '',
    correctAnswer: isEditMode ? exerciseData?.correctAnswer || '' : '',
    blocks: isEditMode ? exerciseData?.blocks || [''] : [''],
    options: isEditMode ? exerciseData?.options || [{ id: 0, text: '' }] : [{ id: 0, text: '' }],
    correctOptionId: isEditMode ? exerciseData?.correctOptionId || 0 : 0,
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [existingExercises, setExistingExercises] = useState<ApiExercise[]>([]);
  const [orderError, setOrderError] = useState("");

  // Load data
  useEffect(() => {
    if (lessonId) {
      loadExistingExercises();
    }
    
    if (isEditMode && exerciseId && !exerciseData) {
      loadExerciseData();
    }
  }, [isEditMode, exerciseId, exerciseData, lessonId]);

  const loadExistingExercises = async () => {
    if (!lessonId) return;
    
    try {
      const response: ApiResponse<ApiExercise[]> = await apiService.getExercises(lessonId);
      if (response.success && response.data) {
        setExistingExercises(response.data);
        
        if (!isEditMode) {
          const existingOrders = response.data.map(ex => ex.order);
          const nextOrder = existingOrders.length > 0 
            ? Math.max(...existingOrders) + 1 
            : 1;
          setFormData(prev => ({ ...prev, order: nextOrder }));
        }
      }
    } catch (err) {
      console.error('Error loading existing exercises:', err);
    }
  };

  const loadExerciseData = async () => {
    if (!exerciseId) return;
    
    setIsLoading(true);
    try {
      const response: ApiResponse<ApiExercise> = await apiService.getExercise(exerciseId);
      if (response.success && response.data) {
        const exercise = response.data;
        setFormData({
          unitId: exercise.unitId,
          subUnitId: exercise.subUnitId,
          lessonId: exercise.lessonId,
          title: exercise.title,
          order: exercise.order,
          type: exercise.type,
          instruction: exercise.instruction,
          hints: exercise.hints || '',
          promptText: exercise.content?.promptText || '',
          promptAudio: exercise.content?.promptAudio || '',
          referenceText: exercise.content?.referenceText || '',
          displayText: exercise.content?.displayText || '',
          correctAnswer: exercise.content?.correctAnswer || '',
          blocks: exercise.content?.blocks || [''],
          options: exercise.content?.options || [{ id: 0, text: '' }],
          correctOptionId: exercise.content?.correctOptionId || 0,
        });
      } else {
        setErrorState(response.error || 'Failed to load exercise data');
      }
    } catch (err) {
      setErrorState('Error loading exercise data');
      console.error('Error loading exercise:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation functions
  const validateField = (field: string, value: any) => {
    clearError(field);
    
    let error = '';
    
    switch (field) {
      case 'title':
      case 'instruction':
      case 'type':
        error = validateRequired(value, field);
        break;
      case 'order':
        error = validateNumber(value, 'Order');
        break;
      case 'promptText':
        if (formData.type === 'vocabulary' || formData.type === 'conversation') {
          error = validateRequired(value, 'Prompt text');
        }
        break;
      case 'correctAnswer':
        if (formData.type === 'vocabulary' || formData.type === 'conversation' || formData.type === 'grammar') {
          error = validateRequired(value, 'Correct answer');
        }
        break;
      case 'referenceText':
        if (formData.type === 'grammar') {
          error = validateRequired(value, 'Reference text');
        }
        break;
      case 'displayText':
        if (formData.type === 'grammar' || formData.type === 'writing') {
          error = validateRequired(value, 'Display text');
        }
        break;
    }
    
    if (error) {
      setError(field, error);
    }
  };

  const validateForm = (): boolean => {
    clearAllErrors();
    let isValid = true;

    // Basic validation
    if (!formData.type) {
      setError('type', 'Exercise type is required');
      isValid = false;
    }
    
    if (!formData.title?.trim()) {
      setError('title', 'Title is required');
      isValid = false;
    }
    
    if (!formData.instruction?.trim()) {
      setError('instruction', 'Instruction is required');
      isValid = false;
    }
    
    if (!formData.order || formData.order < 1) {
      setError('order', 'Order must be a positive number');
      isValid = false;
    }

    // Type-specific validation
    if (formData.type === 'vocabulary' || formData.type === 'conversation') {
      if (!formData.promptText?.trim()) {
        setError('promptText', 'Prompt text is required for this exercise type');
        isValid = false;
      }
      if (!formData.correctAnswer?.trim()) {
        setError('correctAnswer', 'Correct answer is required for this exercise type');
        isValid = false;
      }
    }

    if (formData.type === 'grammar') {
      if (!formData.referenceText?.trim()) {
        setError('referenceText', 'Reference text is required for grammar exercises');
        isValid = false;
      }
      if (!formData.correctAnswer?.trim()) {
        setError('correctAnswer', 'Correct answer is required for grammar exercises');
        isValid = false;
      }
    }

    if (formData.type === 'writing' && formData.options && formData.options.length > 0) {
      formData.options.forEach((option, index) => {
        if (!option.text.trim()) {
          setError(`option-${index}`, `Option ${index + 1} cannot be empty`);
          isValid = false;
        }
      });
    }

    return isValid;
  };

  // Order validation
  const validateOrder = (orderValue: number): boolean => {
    if (orderValue < 1) {
      setOrderError("Order must be a positive number");
      return false;
    }
    
    const existingOrders = existingExercises
      .filter(ex => !isEditMode || ex.id !== exerciseId)
      .map(ex => ex.order);
    
    if (existingOrders.includes(orderValue)) {
      setOrderError(`Order ${orderValue} is already used`);
      return false;
    }
    
    setOrderError("");
    return true;
  };

  const handleOrderChange = (value: string) => {
    const orderNum = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, order: orderNum }));
    validateOrder(orderNum);
  };

  const exerciseTypes = [
    { value: "vocabulary", label: "Vocabulary" },
    { value: "grammar", label: "Grammar" },
    { value: "conversation", label: "Conversation" },
    { value: "listening", label: "Listening" },
    { value: "writing", label: "Writing" },
  ];

  // Fixed Audio function - returns Promise<void>
  const convertTextToAudio = async (text: string): Promise<void> => {
    setIsGeneratingAudio(true);
    try {
      // Check if EdgeTTS is available
      if (typeof EdgeTTS === 'undefined') {
        throw new Error('EdgeTTS is not available. Please check the import.');
      }

      const tts = new EdgeTTS(text, "am-ET-MekdesNeural");
      const result = await tts.synthesize();

      const audioArrayBuffer = await result.audio.arrayBuffer();
      const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mpeg" });

      // Create URL for playback
      const audioUrl = URL.createObjectURL(audioBlob);
      setFormData(prev => ({ ...prev, promptAudio: audioUrl }));
      
      // Download the audio file
      const timestamp = new Date().getTime();
      const fileName = `audio_${timestamp}.mp3`;
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = fileName;
      a.click();
      
      // Return void instead of string
      return;
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Failed to generate audio. Please try again.");
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Prepare exercise data for API
  const prepareExerciseData = (): Omit<ApiExercise, 'id' | 'createdAt' | 'updatedAt'> => {
    const baseData = {
      unitId: formData.unitId,
      subUnitId: formData.subUnitId,
      lessonId: formData.lessonId,
      title: formData.title || formData.instruction.substring(0, 30) || 'New Exercise',
      order: formData.order,
      type: formData.type,
      instruction: formData.instruction,
      hints: formData.hints,
      content: {} as any
    };

    switch (formData.type) {
      case "vocabulary":
      case "conversation":
        baseData.content = {
          promptText: formData.promptText,
          ...(formData.promptAudio && { promptAudio: formData.promptAudio }),
          correctAnswer: formData.correctAnswer,
        };
        break;
      case "grammar":
        baseData.content = {
          referenceText: formData.referenceText,
          displayText: formData.displayText,
          correctAnswer: formData.correctAnswer,
        };
        break;
      case "listening":
        baseData.content = {
          promptAudio: formData.promptAudio,
        };
        if (formData.displayText) {
          baseData.content.displayText = formData.displayText;
          baseData.content.options = formData.options?.filter(opt => opt.text.trim());
          baseData.content.correctOptionId = formData.correctOptionId;
          baseData.content.correctAnswer = formData.correctAnswer;
        }
        break;
      case "writing":
        baseData.content = {
          displayText: formData.displayText,
          options: formData.options?.filter(opt => opt.text.trim()),
          correctOptionId: formData.correctOptionId,
        };
        break;
    }

    if (formData.blocks && formData.blocks.some(block => block.trim())) {
      baseData.content.blocks = formData.blocks.filter(block => block.trim());
    }

    return baseData;
  };

  // Save exercise with validation
  const handleSave = async () => {
    if (!validateForm()) {
      alert('Please fix the validation errors before saving.');
      return;
    }

    if (!validateOrder(formData.order)) {
      alert(`Please fix the order error: ${orderError}`);
      return;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      const exerciseData = prepareExerciseData();
      let response: ApiResponse<ApiExercise>;

      if (isEditMode && exerciseId) {
        response = await apiService.updateExercise(exerciseId, exerciseData);
      } else {
        response = await apiService.createExercise(exerciseData);
      }

      if (response.success) {
        alert(`Exercise ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/lessons', {
          state: { unitId, subUnitId, subUnitTitle: lessonTitle, lessonId }
        });
      } else {
        setErrorState(response.error || `Failed to ${isEditMode ? 'update' : 'create'} exercise`);
      }
    } catch (err) {
      setErrorState(`Error ${isEditMode ? 'updating' : 'creating'} exercise`);
      console.error('Error saving exercise:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update form field helper
  const updateField = <K extends keyof ExerciseFormData>(field: K, value: ExerciseFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    
    if (field === 'order') {
      validateOrder(value as number);
    }
  };

  if (isLoading && isEditMode && !exerciseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading exercise data...</div>
      </div>
    );
  }

  return (
    <div className="font-body bg-gray-50 min-h-screen">
      <main className="flex-1 px-10 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/lessons"
              state={{ unitId, subUnitId, subUnitTitle: lessonTitle, lessonId }}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Back to Lessons
            </Link>

            {isEditMode && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
                <p className="text-yellow-800 text-sm font-medium">✏️ Editing Exercise: {formData.title}</p>
                {lessonTitle && <p className="text-yellow-700 text-xs mt-1">Lesson: {lessonTitle}</p>}
              </div>
            )}

            {!isEditMode && lessonId && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                <p className="text-blue-800 text-sm font-medium">Creating new exercise for Lesson: {lessonTitle}</p>
                <p className="text-blue-700 text-xs mt-1">Lesson ID: {lessonId}</p>
                {existingExercises.length > 0 && (
                  <p className="text-blue-700 text-xs mt-1">Existing exercises: {existingExercises.length}</p>
                )}
              </div>
            )}

            <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">
              {isEditMode ? "Edit Exercise" : "Create New Exercise"}
            </h1>
            <p className="text-gray-500 text-base font-normal leading-normal mt-1">
              {isEditMode ? "Modify the exercise details below." : "Configure the details for a new exercise."}
            </p>
          </div>

          {errorState && (
            <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-800 text-sm">Error: {errorState}</p>
            </div>
          )}

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium mb-2">Please fix the following errors:</p>
              <ul className="text-red-700 text-sm list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                    Exercise Type {errors.type && <span className="text-red-500">*</span>}
                  </p>
                  <select
                    className={`w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    value={formData.type}
                    onChange={(e) => updateField('type', e.target.value as any)}
                    disabled={isEditMode}
                  >
                    <option value="">Select a type...</option>
                    {exerciseTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </label>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                {isEditMode && <p className="text-gray-500 text-xs mt-1">Exercise type cannot be changed in edit mode</p>}
              </div>

              <ValidatedField
                label="Order"
                type="number"
                value={formData.order}
                onChange={(value) => handleOrderChange(value)}
                onBlur={() => validateField('order', formData.order)}
                error={errors.order || orderError}
                required
                placeholder="1"
              />
            </div>

            <ValidatedField
              label="Exercise Title"
              value={formData.title}
              onChange={(value) => updateField('title', value)}
              onBlur={() => validateField('title', formData.title)}
              error={errors.title}
              required
              placeholder="e.g., Basic Greetings Practice"
            />

            <ValidatedField
              label="Instruction"
              value={formData.instruction}
              onChange={(value) => updateField('instruction', value)}
              onBlur={() => validateField('instruction', formData.instruction)}
              error={errors.instruction}
              required
              placeholder="e.g., Translate this sentence"
            />

            {/* Dynamic Fields Based on Exercise Type */}
            {formData.type && (
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Exercise Content</h3>

                {/* Vocabulary/Conversation Fields */}
                {(formData.type === "vocabulary" || formData.type === "conversation") && (
                  <>
                    <ValidatedField
                      label="Prompt Text"
                      value={formData.promptText || ''}
                      onChange={(value) => updateField('promptText', value)}
                      onBlur={() => validateField('promptText', formData.promptText)}
                      error={errors.promptText}
                      required
                      placeholder="e.g., Hello"
                    />
                    <ValidatedField
                      label="Correct Answer"
                      value={formData.correctAnswer || ''}
                      onChange={(value) => updateField('correctAnswer', value)}
                      onBlur={() => validateField('correctAnswer', formData.correctAnswer)}
                      error={errors.correctAnswer}
                      required
                      placeholder="e.g., ሰላም"
                    />
                  </>
                )}

                {/* Grammar Fields */}
                {formData.type === "grammar" && (
                  <>
                    <ValidatedField
                      label="Reference Text"
                      value={formData.referenceText || ''}
                      onChange={(value) => updateField('referenceText', value)}
                      onBlur={() => validateField('referenceText', formData.referenceText)}
                      error={errors.referenceText}
                      required
                      placeholder="e.g., She is a doctor."
                    />
                    <ValidatedField
                      label="Display Text"
                      value={formData.displayText || ''}
                      onChange={(value) => updateField('displayText', value)}
                      onBlur={() => validateField('displayText', formData.displayText)}
                      error={errors.displayText}
                      required
                      placeholder="e.g., እሷ ____ ናት።"
                    />
                    <ValidatedField
                      label="Correct Answer"
                      value={formData.correctAnswer || ''}
                      onChange={(value) => updateField('correctAnswer', value)}
                      onBlur={() => validateField('correctAnswer', formData.correctAnswer)}
                      error={errors.correctAnswer}
                      required
                      placeholder="e.g., እሷ ሀኪም ናት።"
                    />
                  </>
                )}

                {/* Writing/Listening Fields */}
                {(formData.type === "writing" || formData.type === "listening") && (
                  <>
                    {formData.type === "listening" && (
                      <ValidatedField
                        label="Display Text (with blanks)"
                        value={formData.displayText || ''}
                        onChange={(value) => updateField('displayText', value)}
                        onBlur={() => validateField('displayText', formData.displayText)}
                        error={errors.displayText}
                        required
                        placeholder="e.g., እሷ ____ ትወዳለች።"
                      />
                    )}
                    
                    <OptionManager
                      options={formData.options || []}
                      correctOptionId={formData.correctOptionId}
                      onOptionsChange={(options) => updateField('options', options)}
                      onCorrectOptionChange={(id) => updateField('correctOptionId', id)}
                      showAudioUrl={formData.type === "listening"}
                    />

                    {formData.type === "listening" && (
                      <ValidatedField
                        label="Correct Answer (for validation)"
                        value={formData.correctAnswer || ''}
                        onChange={(value) => updateField('correctAnswer', value)}
                        placeholder="Expected answer"
                      />
                    )}
                  </>
                )}

                {/* Blocks Section */}
                {(formData.type === "vocabulary" || formData.type === "grammar" || formData.type === "writing") && (
                  <BlockManager
                    blocks={formData.blocks || []}
                    onBlocksChange={(blocks) => updateField('blocks', blocks)}
                  />
                )}

                {/* Audio Section */}
                <AudioPlayer
                  audioUrl={formData.promptAudio || ''}
                  onAudioUrlChange={(url) => updateField('promptAudio', url)}
                  onTextToAudio={convertTextToAudio}
                  generating={isGeneratingAudio}
                />

                {/* Hints */}
                <div>
                  <label className="flex flex-col">
                    <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                      Hints/Feedback <span className="text-gray-400">(Optional)</span>
                    </p>
                    <textarea
                      className="w-full rounded-md border border-gray-300 bg-white min-h-20 p-3 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Pay attention to the verb conjugation."
                      value={formData.hints || ''}
                      onChange={(e) => updateField('hints', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end pt-6 gap-3">
              <Link
                to="/lessons"
                state={{ unitId, subUnitId, subUnitTitle: lessonTitle, lessonId }}
                className="flex min-w-[84px] items-center justify-center rounded-md h-10 px-4 bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                <span className="truncate">Cancel</span>
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={!formData.type || isLoading || !!orderError || Object.keys(errors).length > 0}
                className="flex min-w-[84px] items-center justify-center rounded-md h-10 px-4 bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {isLoading ? "Saving..." : isEditMode ? "Update Exercise" : "Save Exercise"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}