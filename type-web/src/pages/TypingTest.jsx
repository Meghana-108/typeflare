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
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [testFinished, setTestFinished] = useState(false);
  const [finishedOnce, setFinishedOnce] = useState(false); // ✅ NEW STATE
  const [stats, setStats] = useState({ wpm: 0, rawWPM: 0, accuracy: 0 });

  const promptText = promptWords.join(" ");

  const loadPrompt = async () => {
    const words = await fetchNewPrompt();
    setPromptWords(words);
  };

  useEffect(() => {
    loadPrompt();
  }, []);

  const handleChange = (value) => {
    // Don't allow further typing after finish
    if (testFinished || value.length > promptText.length || finishedOnce) return;

    if (!hasStarted && value.length > 0) {
      setHasStarted(true);
      setStartTime(Date.now());
    }

    setTypedText(value);

    if (value.length === promptText.length) {
      finishTest(value);
    }
  };

  const finishTest = (finalText) => {
    const duration = (Date.now() - startTime) / 60000;
    const correctChars = promptText.split("").filter((c, i) => c === finalText[i]).length;
    const totalTyped = finalText.length;
    const wpm = Math.round((correctChars / 5) / duration);
    const rawWPM = Math.round((totalTyped / 5) / duration);
    const accuracy = Math.round((correctChars / totalTyped) * 100);

    setStats({ wpm, rawWPM, accuracy });
    setTestFinished(true);
    setFinishedOnce(true); // ✅ Prevent any further change
  };

  const handleReset = async () => {
    setTypedText("");
    setHasStarted(false);
    setTestFinished(false);
    setFinishedOnce(false); // ✅ Reset the protection flag
    setStartTime(null);
    setStats({ wpm: 0, rawWPM: 0, accuracy: 0 });
    await loadPrompt();
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
              promptWords={promptWords}
              typedText={typedText}
              hasStarted={hasStarted}
            />
            <TypingInput
              typedText={typedText}
              onChange={handleChange}
              onReset={handleReset}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default TypingTest;
