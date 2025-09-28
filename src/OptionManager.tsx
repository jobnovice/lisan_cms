// src/components/OptionManager.tsx
import React from "react";
import { Plus, X } from "lucide-react";

interface Option {
  id: number;
  text: string;
  option_audio_url?: string;
}

interface OptionManagerProps {
  options: Option[];
  correctOptionId: number;
  onOptionsChange: (options: Option[]) => void;
  onCorrectOptionChange: (id: number) => void;
  label?: string;
  showAudioUrl?: boolean;
}

export const OptionManager: React.FC<OptionManagerProps> = ({
  options,
  correctOptionId,
  onOptionsChange,
  onCorrectOptionChange,
  label = "Answer Options",
  showAudioUrl = false
}) => {
  const addOption = () => {
    onOptionsChange([...options, { id: options.length, text: '' }]);
  };

  const updateOption = (index: number, field: keyof Option, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions.map((opt, i) => ({ ...opt, id: i })));
      
      // Adjust correct option ID if needed
      if (correctOptionId === index) {
        onCorrectOptionChange(Math.max(0, newOptions.length - 1));
      } else if (correctOptionId > index) {
        onCorrectOptionChange(correctOptionId - 1);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-700 text-sm font-medium leading-normal">
          {label}
        </p>
        <button
          type="button"
          onClick={addOption}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          <Plus size={16} />
          Add Option
        </button>
      </div>
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-3 mb-3">
          <input
            type="radio"
            name="correct_option"
            checked={correctOptionId === index}
            onChange={() => onCorrectOptionChange(index)}
            className="text-blue-500"
          />
          <input
            type="text"
            className="flex-1 w-full rounded-md border border-gray-300 bg-white h-10 p-3 text-sm"
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChange={(e) => updateOption(index, 'text', e.target.value)}
          />
          {showAudioUrl && (
            <input
              type="text"
              className="w-48 rounded-md border border-gray-300 bg-white h-10 p-3 text-sm"
              placeholder="Audio URL (optional)"
              value={option.option_audio_url || ''}
              onChange={(e) => updateOption(index, 'option_audio_url', e.target.value)}
            />
          )}
          {options.length > 1 && (
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};