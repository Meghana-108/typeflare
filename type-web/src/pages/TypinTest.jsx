import React, { useState, useEffect, useRef } from "react";


const TypingTest = ({ promptWords }) => {
  const prompt = promptWords.join(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputHistory, setInputHistory] = useState([]);
  const [incorrect, setIncorrect] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sentToBackend, setSentToBackend] = useState(false);

  const hiddenInputRef = useRef(null); // ✅ Ref for invisible input

  useEffect(() => {
    const input = hiddenInputRef.current;
    if (input) input.focus(); // Focus on load
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (!startTime) setStartTime(Date.now());
      if (key.length !== 1 && key !== " ") return;

      const expectedChar = prompt[currentIndex];

      if (key === expectedChar) {
        setInputHistory((prev) => [...prev, { char: key, correct: true }]);
        setCurrentIndex((prev) => prev + 1);
        setIncorrect(false);

        if (currentIndex + 1 === prompt.length) {
          const completedAt = Date.now();
          setEndTime(completedAt);
          sendResultToBackend(completedAt);
        }
      } else {
        setIncorrect(true);
        setInputHistory((prev) => [...prev, { char: key, correct: false }]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, prompt]);

  const resetTest = () => {
    setCurrentIndex(0);
    setInputHistory([]);
    setIncorrect(false);
    setStartTime(null);
    setEndTime(null);
    setSentToBackend(false);
    hiddenInputRef.current?.focus(); // ✅ Re-focus
  };

  const calculateStats = (end = null) => {
    const totalTyped = inputHistory.length;
    const correctTyped = inputHistory.filter((i) => i.correct).length;

    const duration = (end || endTime || Date.now()) - startTime || 1;
    const minutes = duration / 1000 / 60;

    const wpm = ((correctTyped / 5) / minutes).toFixed(2);
    const rawWpm = ((totalTyped / 5) / minutes).toFixed(2);
    const accuracy = ((correctTyped / totalTyped) * 100).toFixed(2);

    return { wpm, rawWpm, accuracy };
  };

  const { wpm, rawWpm, accuracy } = calculateStats();

  const sendResultToBackend = async (completedAt) => {
    if (sentToBackend) return;

    const stats = calculateStats(completedAt);

    try {
      await fetch("http://localhost:8000/api/typing-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptWords,
          wpm: parseFloat(stats.wpm),
          raw_wpm: parseFloat(stats.rawWpm),
          accuracy: parseFloat(stats.accuracy),
          timestamp: new Date(completedAt).toISOString()
        })
      });
      setSentToBackend(true);
    } catch (err) {
      console.error("Failed to save result:", err);
    }
  };

  const renderPrompt = () => {
    return prompt.split("").map((char, idx) => {
      let className = "text-gray-400";

      if (idx < currentIndex) {
        className = "text-green-500";
      } else if (idx === currentIndex) {
        className = incorrect ? "text-red-500 underline" : "underline";
      }

      const displayChar = char === " " ? "\u00A0" : char;

      return (
        <span key={idx} className={`${className} font-mono`}>
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Hidden input to track key focus */}
      <input
        ref={hiddenInputRef}
        style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
      />

      <div className="bg-gray-800 p-6 rounded-md shadow-md min-h-[140px]">
        <div className="flex flex-wrap gap-[1px] text-xl">{renderPrompt()}</div>
        <p className="text-sm text-gray-500 mt-4">
          Type the prompt above exactly. Mistakes must be corrected before moving on.
        </p>
      </div>

      <div className="flex gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-green-400">{wpm}</p>
          <p className="text-sm text-gray-400">WPM</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-400">{rawWpm}</p>
          <p className="text-sm text-gray-400">Raw WPM</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">{accuracy}%</p>
          <p className="text-sm text-gray-400">Accuracy</p>
        </div>
      </div>

      <button
        onClick={resetTest}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
      >
        Reset
      </button>
    </div>
  );
};

export default TypingTest;
