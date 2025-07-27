const TypingPrompt = ({ promptWords, typedText, hasStarted }) => {
  const promptText = promptWords.join(" ");

  return (
    <div className="w-full bg-[#1c1c1c] rounded-xl p-6 text-xl font-mono tracking-wide leading-relaxed break-words">
      {promptText.split("").map((char, index) => {
        let className = "text-gray-400";

        if (hasStarted && index < typedText.length) {
          className = typedText[index] === char ? "text-green-400" : "text-red-500";
        }

        // 👉 Blinking cursor at current position
        const showCursor = index === typedText.length;

        return (
          <span
            key={index}
            className={`${className} ${showCursor ? "border-l-2 border-white animate-pulse" : ""}`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};


export default TypingPrompt;
