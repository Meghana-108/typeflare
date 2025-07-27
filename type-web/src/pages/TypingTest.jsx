import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsPanel from "../components/StatsPanel";
import TypingPrompt from "../components/TypingPrompt";
import TypingInput from "../components/TypingInput";
import ResultPanel from "../components/ResultPanel";
import { fetchNewPrompt } from "../utils/fetchNewPrompt";

const TypingTest = () => {
  const [promptWords, setPromptWords] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [testFinished, setTestFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState({ wpm: 0, rawWPM: 0, accuracy: 0 });
  const [resetVersion, setResetVersion] = useState(0); // 👈 Tracks resets

  const promptText = promptWords.join(" ");

  useEffect(() => {
    const loadPrompt = async () => {
      const words = await fetchNewPrompt();
      setPromptWords(words);
    };
    loadPrompt();
  }, [resetVersion]); // 👈 Runs only on first mount and reset

  const handleChangeText = (value) => {
    if (testFinished || value.length > promptText.length) return;

    if (!hasStarted && value.length > 0) {
      setHasStarted(true);
      setStartTime(Date.now());
    }

    setTypedText(value);

    if (value.length === promptText.length) {
      setTestFinished(true);
      calculateStats(value);
    }
  };

  const calculateStats = (typed) => {
    const time = (Date.now() - startTime) / 60000;
    const correct = promptText.split("").filter((c, i) => c === typed[i]).length;
    const total = typed.length;
    const wpm = Math.round((correct / 5) / time);
    const rawWPM = Math.round((total / 5) / time);
    const accuracy = Math.round((correct / total) * 100);
    setStats({ wpm, rawWPM, accuracy });
  };

  const handleReset = () => {
    setTypedText("");
    setHasStarted(false);
    setTestFinished(false);
    setStartTime(null);
    setStats({ wpm: 0, rawWPM: 0, accuracy: 0 });
    setResetVersion((prev) => prev + 1); // 👈 Triggers full new test
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      <main className="flex flex-col items-center px-4 py-10 max-w-4xl mx-auto">
        <StatsPanel />
        {testFinished ? (
          <ResultPanel stats={stats} />
        ) : (
          <>
            <TypingPrompt
              key={resetVersion} // 👈 Forces full reset of prompt color states
              promptWords={promptWords}
              typedText={typedText}
              hasStarted={hasStarted}
            />
            <TypingInput
              typedText={typedText}
              onChange={handleChangeText}
              onReset={handleReset}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default TypingTest;
