export const fetchNewPrompt = async () => {
  const wordPool = ["hello", "world", "type", "test", "keyboard", "quick", "react", "monkey"];
  const words = Array.from({ length: 25 }, () =>
    wordPool[Math.floor(Math.random() * wordPool.length)]
  );
  return words;
};
