import { useEffect, useRef } from "react";

const TypingInput = ({ typedText, onChange, onReset }) => {
  const inputRef = useRef(null); // 🔁

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();           // 👀 focus it
      inputRef.current.selectionStart = 0; // move cursor to start
      inputRef.current.selectionEnd = 0;
    }
  }, [typedText === ""]); // runs only on reset when text is cleared

  return (
    <div className="flex flex-col items-center mt-6 w-full">
      <textarea
        ref={inputRef} // 🔁
        className="bg-black text-white p-3 w-full rounded-lg font-mono text-lg resize-none"
        rows={2}
        autoFocus
        value={typedText}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={onReset}
          className="bg-black border border-gray-600 text-white px-5 py-2 rounded-md hover:border-green-400"
        >
          ⟳ Reset
        </button>
      </div>
    </div>
  );
};

export default TypingInput;
