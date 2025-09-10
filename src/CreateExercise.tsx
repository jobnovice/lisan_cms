import { useState } from "react";
import { Plus, X, Play, Pause, Volume2 } from "lucide-react";
import { EdgeTTS } from "edge-tts-universal";

interface Option {
    id: number;
    text: string;
    option_audio_url?: string;
}

interface ExerciseData {
    id: string;
    type: string;
    subtype?: string;
    instruction: string;
    data: any;
}

export default function CreateExercise() {
    const [exerciseType, setExerciseType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [instruction, setInstruction] = useState("");
    const [promptText, setPromptText] = useState("");
    const [promptAudio, setPromptAudio] = useState("");
    const [referenceText, setReferenceText] = useState("");
    const [displayText, setDisplayText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [blocks, setBlocks] = useState<string[]>([""]);
    const [options, setOptions] = useState<Option[]>([{ id: 0, text: "" }]);
    const [correctOptionId, setCorrectOptionId] = useState(0);
    const [hints, setHints] = useState("");

    // New states for audio generation
    const [audioText, setAudioText] = useState("");
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");
    const [audioPlayerUrl, setAudioPlayerUrl] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    const exerciseTypes = [
        { value: "translation", label: "Translation" },
        { value: "complete_sentence", label: "Complete Sentence" },
        { value: "fill_in_blank", label: "Fill in the Blank" },
        { value: "speaking", label: "Speaking" },
        { value: "listening", label: "Listening" },
    ];

    const getSubtypes = (type: string) => {
        switch (type) {
            case "translation":
                return [
                    { value: "block_build", label: "Block Build" },
                    { value: "free_text", label: "Free Text" },
                ];
            case "complete_sentence":
                return [
                    { value: "partial_free_text", label: "Partial Free Text" },
                    {
                        value: "partial_block_build",
                        label: "Partial Block Build",
                    },
                ];
            case "listening":
                return [
                    { value: "choose_missing", label: "Choose Missing" },
                    { value: "type_missing", label: "Type Missing" },
                    { value: "free_text", label: "Free Text" },
                    { value: "block_build", label: "Block Build" },
                ];
            default:
                return [];
        }
    };

    const addBlock = () => {
        setBlocks([...blocks, ""]);
    };

    const updateBlock = (index: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index] = value;
        setBlocks(newBlocks);
    };

    const removeBlock = (index: number) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter((_, i) => i !== index));
        }
    };

    const addOption = () => {
        setOptions([...options, { id: options.length, text: "" }]);
    };

    const updateOption = (
        index: number,
        field: keyof Option,
        value: string | number
    ) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const removeOption = (index: number) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions.map((opt, i) => ({ ...opt, id: i })));
            if (correctOptionId >= newOptions.length) {
                setCorrectOptionId(Math.max(0, newOptions.length - 1));
            }
        }
    };

    // Function to convert text to audio
    const convertTextToAudio = async () => {
        if (!audioText.trim()) {
            alert("Please enter text to convert to audio");
            return;
        }

        setIsGeneratingAudio(true);

        try {
            const tts = new EdgeTTS(audioText, "am-ET-MekdesNeural");
            const result = await tts.synthesize();

            // Convert to blob and trigger download
            const audioArrayBuffer = await result.audio.arrayBuffer();
            const audioBlob = new Blob([audioArrayBuffer], {
                type: "audio/mpeg",
            });

            const timestamp = new Date().getTime();
            const fileName = `audio_${timestamp}.mp3`;

            // Create download link
            const audioUrl = URL.createObjectURL(audioBlob);
            const a = document.createElement("a");
            a.href = audioUrl;
            a.download = fileName;
            a.click();

            // Set the blob URL for audio player
            setGeneratedAudioUrl(audioUrl);
            setAudioPlayerUrl(audioUrl);
            setPromptAudio(audioUrl); // Update the promptAudio state
        } catch (error) {
            console.error("Error generating audio:", error);
            alert("Failed to generate audio. Please try again.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    // Function to handle audio playback
    const togglePlayback = () => {
        const audioElement = document.getElementById(
            "audio-player"
        ) as HTMLAudioElement;
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const generateExerciseJSON = () => {
        const baseExercise: ExerciseData = {
            id: `${exerciseType.substring(0, 2)}_${Date.now()
                .toString()
                .slice(-3)}`,
            type: exerciseType,
            instruction: instruction || "Complete this exercise",
            data: {},
        };
        if (subtype) {
            baseExercise.subtype = subtype;
        }
        switch (exerciseType) {
            case "translation":
                baseExercise.data = {
                    prompt_text: promptText,
                    ...(promptAudio && { prompt_audio_url: promptAudio }),
                    correct_answer: correctAnswer,
                };
                if (subtype === "block_build") {
                    baseExercise.data.blocks = blocks.filter((block) =>
                        block.trim()
                    );
                }
                break;
            case "complete_sentence":
                baseExercise.data = {
                    reference_text: referenceText,
                    display_text: displayText,
                    correct_answer: correctAnswer,
                };
                if (subtype === "partial_block_build") {
                    baseExercise.data.blocks = blocks.filter((block) =>
                        block.trim()
                    );
                }
                break;
            case "fill_in_blank":
                baseExercise.data = {
                    display_text: displayText,
                    options: options
                        .filter((opt) => opt.text.trim())
                        .map((opt, i) => ({
                            id: i,
                            text: opt.text,
                        })),
                    correct_option_id: correctOptionId,
                };
                break;
            case "speaking":
                baseExercise.data = {
                    prompt_text: promptText,
                    ...(promptAudio && { prompt_audio_url: promptAudio }),
                    correct_answer: correctAnswer,
                };
                break;
            case "listening":
                baseExercise.data = {
                    prompt_audio_url: promptAudio,
                };
                if (subtype === "choose_missing") {
                    baseExercise.data.display_text = displayText;
                    baseExercise.data.options = options
                        .filter((opt) => opt.text.trim())
                        .map((opt, i) => ({
                            id: i,
                            text: opt.text,
                            ...(opt.option_audio_url && {
                                option_audio_url: opt.option_audio_url,
                            }),
                        }));
                    baseExercise.data.correct_option_id = correctOptionId;
                } else if (subtype === "type_missing") {
                    baseExercise.data.display_text = displayText;
                    baseExercise.data.correct_answer = correctAnswer;
                } else if (subtype === "free_text") {
                    baseExercise.data.correct_answer = correctAnswer;
                } else if (subtype === "block_build") {
                    baseExercise.data.blocks = blocks.filter((block) =>
                        block.trim()
                    );
                    baseExercise.data.correct_answer = correctAnswer;
                }
                break;
        }
        return JSON.stringify(baseExercise, null, 4);
    };

    const handleSave = () => {
        const json = generateExerciseJSON();
        console.log("Generated Exercise JSON:", json);
        alert("Exercise saved! Check console for JSON output.");
    };

    return (
        <div className="font-body bg-gray-50 min-h-screen">
            {/* Main Content */}
            <main className="flex-1 px-10 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">
                            Create New Exercise
                        </h1>
                        <p className="text-gray-500 text-base font-normal leading-normal mt-1">
                            Configure the details for a new exercise to be added
                            to the Amharic learning app.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                        {/* Exercise Type Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col">
                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                    Exercise Type
                                </p>
                                <select
                                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 py-2 text-sm font-normal leading-normal"
                                    value={exerciseType}
                                    onChange={(e) => {
                                        setExerciseType(e.target.value);
                                        setSubtype("");
                                    }}
                                >
                                    <option value="">Select a type...</option>
                                    {exerciseTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {exerciseType &&
                                getSubtypes(exerciseType).length > 0 && (
                                    <label className="flex flex-col">
                                        <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                            Subtype
                                        </p>
                                        <select
                                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                            value={subtype}
                                            onChange={(e) =>
                                                setSubtype(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select a subtype...
                                            </option>
                                            {getSubtypes(exerciseType).map(
                                                (sub) => (
                                                    <option
                                                        key={sub.value}
                                                        value={sub.value}
                                                    >
                                                        {sub.label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </label>
                                )}
                        </div>
                        {/* Instruction */}
                        <div>
                            <label className="flex flex-col">
                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                    Instruction
                                </p>
                                <input
                                    type="text"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                    placeholder="e.g., Translate this sentence"
                                    value={instruction}
                                    onChange={(e) =>
                                        setInstruction(e.target.value)
                                    }
                                />
                            </label>
                        </div>
                        {/* Dynamic Fields Based on Exercise Type */}
                        {exerciseType && (
                            <div className="space-y-6 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Exercise Content
                                </h3>
                                {/* Translation Fields */}
                                {exerciseType === "translation" && (
                                    <>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Prompt Text (English)
                                                </p>
                                                <textarea
                                                    className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white min-h-20 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., My brother is taller than my sister."
                                                    value={promptText}
                                                    onChange={(e) =>
                                                        setPromptText(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Correct Answer (Amharic)
                                                </p>
                                                <textarea
                                                    className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white min-h-20 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., ወንድሜ ከእህቴ ይረዝማል"
                                                    value={correctAnswer}
                                                    onChange={(e) =>
                                                        setCorrectAnswer(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}
                                {/* Complete Sentence Fields */}
                                {exerciseType === "complete_sentence" && (
                                    <>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Reference Text (English)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., She is a doctor."
                                                    value={referenceText}
                                                    onChange={(e) =>
                                                        setReferenceText(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Display Text (with blanks)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., እሷ ____ ናት።"
                                                    value={displayText}
                                                    onChange={(e) =>
                                                        setDisplayText(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Complete Answer (Amharic)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., እሷ ሀኪም ናት።"
                                                    value={correctAnswer}
                                                    onChange={(e) =>
                                                        setCorrectAnswer(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}
                                {/* Fill in the Blank Fields */}
                                {exerciseType === "fill_in_blank" && (
                                    <>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Display Text (with blanks)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., እኔ ____ እጠጣለሁ።"
                                                    value={displayText}
                                                    onChange={(e) =>
                                                        setDisplayText(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-gray-700 text-sm font-medium leading-normal">
                                                    Answer Options
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={addOption}
                                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Option
                                                </button>
                                            </div>
                                            {options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 mb-3"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="correct_option"
                                                        checked={
                                                            correctOptionId ===
                                                            index
                                                        }
                                                        onChange={() =>
                                                            setCorrectOptionId(
                                                                index
                                                            )
                                                        }
                                                        className="text-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="flex-1 form-input resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-10 p-3 text-sm font-normal leading-normal"
                                                        placeholder={`Option ${
                                                            index + 1
                                                        }`}
                                                        value={option.text}
                                                        onChange={(e) =>
                                                            updateOption(
                                                                index,
                                                                "text",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {options.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeOption(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600 p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {/* Speaking Fields */}
                                {exerciseType === "speaking" && (
                                    <>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Prompt Text (Amharic)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., ሰላም እንዴት ነህ?"
                                                    value={promptText}
                                                    onChange={(e) =>
                                                        setPromptText(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex flex-col">
                                                <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                    Expected Answer (Amharic)
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                    placeholder="e.g., ሰላም እንዴት ነህ?"
                                                    value={correctAnswer}
                                                    onChange={(e) =>
                                                        setCorrectAnswer(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}
                                {/* Listening Fields */}
                                {exerciseType === "listening" && subtype && (
                                    <>
                                        {(subtype === "choose_missing" ||
                                            subtype === "type_missing") && (
                                            <div>
                                                <label className="flex flex-col">
                                                    <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                        Display Text (with
                                                        blanks)
                                                    </p>
                                                    <input
                                                        type="text"
                                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                        placeholder="e.g., እሷ ____ ትወዳለች።"
                                                        value={displayText}
                                                        onChange={(e) =>
                                                            setDisplayText(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {subtype === "choose_missing" && (
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-gray-700 text-sm font-medium leading-normal">
                                                        Answer Options
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={addOption}
                                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Option
                                                    </button>
                                                </div>
                                                {options.map(
                                                    (option, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3 mb-3"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="correct_option"
                                                                checked={
                                                                    correctOptionId ===
                                                                    index
                                                                }
                                                                onChange={() =>
                                                                    setCorrectOptionId(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-blue-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                className="flex-1 form-input resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-10 p-3 text-sm font-normal leading-normal"
                                                                placeholder={`Option ${
                                                                    index + 1
                                                                }`}
                                                                value={
                                                                    option.text
                                                                }
                                                                onChange={(e) =>
                                                                    updateOption(
                                                                        index,
                                                                        "text",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                className="w-48 form-input resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-10 p-3 text-sm font-normal leading-normal"
                                                                placeholder="Audio URL (optional)"
                                                                value={
                                                                    option.option_audio_url ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateOption(
                                                                        index,
                                                                        "option_audio_url",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            {options.length >
                                                                1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeOption(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-600 p-1"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {(subtype === "type_missing" ||
                                            subtype === "free_text" ||
                                            subtype === "block_build") && (
                                            <div>
                                                <label className="flex flex-col">
                                                    <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                                        Correct Answer
                                                    </p>
                                                    <input
                                                        type="text"
                                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                                        placeholder="Expected answer"
                                                        value={correctAnswer}
                                                        onChange={(e) =>
                                                            setCorrectAnswer(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </>
                                )}
                                {/* Blocks Section */}
                                {((exerciseType === "translation" &&
                                    subtype === "block_build") ||
                                    (exerciseType === "complete_sentence" &&
                                        subtype === "partial_block_build") ||
                                    (exerciseType === "listening" &&
                                        subtype === "block_build")) && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-gray-700 text-sm font-medium leading-normal">
                                                Answer Blocks
                                            </p>
                                            <button
                                                type="button"
                                                onClick={addBlock}
                                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Block
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {blocks.map((block, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3"
                                                >
                                                    <input
                                                        type="text"
                                                        className="flex-1 form-input resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-10 p-3 text-sm font-normal leading-normal"
                                                        placeholder={`Block ${
                                                            index + 1
                                                        }`}
                                                        value={block}
                                                        onChange={(e) =>
                                                            updateBlock(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {blocks.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeBlock(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600 p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Audio Generation Section */}
                                <div>
                                    <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                        Generate Audio from Text
                                    </p>
                                    <div className="flex flex-col space-y-3">
                                        <textarea
                                            className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white min-h-20 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                                            placeholder="Enter Amharic text to convert to audio..."
                                            value={audioText}
                                            onChange={(e) =>
                                                setAudioText(e.target.value)
                                            }
                                        />
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={convertTextToAudio}
                                                disabled={
                                                    isGeneratingAudio ||
                                                    !audioText.trim()
                                                }
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Volume2 className="w-4 h-4" />
                                                {isGeneratingAudio
                                                    ? "Generating..."
                                                    : "Convert to Audio"}
                                            </button>

                                            {/* Audio Player */}
                                            {audioPlayerUrl && (
                                                <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={togglePlayback}
                                                        className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                                    >
                                                        {isPlaying ? (
                                                            <Pause className="w-4 h-4" />
                                                        ) : (
                                                            <Play className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <span className="text-sm text-gray-600">
                                                        Play generated audio
                                                    </span>
                                                    <audio
                                                        id="audio-player"
                                                        src={audioPlayerUrl}
                                                        onEnded={() =>
                                                            setIsPlaying(false)
                                                        }
                                                        className="hidden"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Manual Audio URL Input (Fallback) */}
                                <div>
                                    <label className="flex flex-col">
                                        <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                            Or Enter Audio URL Manually{" "}
                                            <span className="text-gray-400">
                                                (Optional)
                                            </span>
                                        </p>
                                        <input
                                            type="text"
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white h-11 p-3 text-sm font-normal leading-normal"
                                            placeholder="https://cdn.example.com/audio/prompt.mp3"
                                            value={promptAudio}
                                            onChange={(e) =>
                                                setPromptAudio(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                {/* Hints */}
                                <div>
                                    <label className="flex flex-col">
                                        <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                                            Hints/Feedback{" "}
                                            <span className="text-gray-400">
                                                (Optional)
                                            </span>
                                        </p>
                                        <textarea
                                            className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-gray-300 bg-white min-h-20 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                                            placeholder="e.g., Pay attention to the verb conjugation."
                                            value={hints}
                                            onChange={(e) =>
                                                setHints(e.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                        {/* Preview JSON */}
                        {exerciseType && (
                            <div className="pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    JSON Preview
                                </h3>
                                <pre className="bg-gray-50 border rounded-md p-4 text-sm overflow-x-auto text-gray-700 max-h-64 overflow-y-auto">
                                    {generateExerciseJSON()}
                                </pre>
                            </div>
                        )}
                        {/* Action Buttons */}
                        <div className="flex justify-end pt-6 gap-3">
                            <button
                                type="button"
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-200 text-gray-700 text-sm font-medium leading-normal tracking-wide hover:bg-gray-300 transition-colors"
                            >
                                <span className="truncate">Cancel</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!exerciseType}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-500 text-white text-sm font-medium leading-normal tracking-wide shadow-sm hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <span className="truncate">Save Exercise</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
