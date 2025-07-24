// src/App.jsx
import { useState } from "react";
import TypingTest from "./TypingTest";
import { commonWords } from "./wordList";

const getRandomPrompt = () => {
  const wordCount = Math.floor(Math.random() * 11) + 20; // 20–30 words
  const shuffled = commonWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, wordCount);
};
const fetchPrompt = async () => {
  const res = await fetch("http://localhost:8000/api/prompt");
  const data = await res.json();
  setPromptWords(data.prompt);
};


function App() {
  const [promptWords, setPromptWords] = useState(getRandomPrompt());

  const handleReset = () => {
    setPromptWords(getRandomPrompt());
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-4">TypeMaster</h1>
      <TypingTest promptWords={promptWords} />
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded text-white font-medium"
      >
        ⟳ Reset Test
      </button>
    </div>
  );
}

export default App;
