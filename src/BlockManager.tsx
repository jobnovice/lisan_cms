// src/components/BlockManager.tsx
import React from "react";
import { Plus, X } from "lucide-react";

interface BlockManagerProps {
  blocks: string[];
  onBlocksChange: (blocks: string[]) => void;
  label?: string;
}

export const BlockManager: React.FC<BlockManagerProps> = ({
  blocks,
  onBlocksChange,
  label = "Answer Blocks"
}) => {
  const addBlock = () => {
    onBlocksChange([...blocks, '']);
  };

  const updateBlock = (index: number, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = value;
    onBlocksChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    if (blocks.length > 1) {
      onBlocksChange(blocks.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-700 text-sm font-medium leading-normal">
          {label} <span className="text-gray-400">(Optional)</span>
        </p>
        <button
          type="button"
          onClick={addBlock}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          <Plus size={16} />
          Add Block
        </button>
      </div>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              className="flex-1 w-full rounded-md border border-gray-300 bg-white h-10 p-3 text-sm"
              placeholder={`Block ${index + 1}`}
              value={block}
              onChange={(e) => updateBlock(index, e.target.value)}
            />
            {blocks.length > 1 && (
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};