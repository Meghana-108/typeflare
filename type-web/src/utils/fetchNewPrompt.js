export const fetchNewPrompt = async () => {
  const wordPool = ["hello", "world", "test", "type", "fast", "keyboard", "speed", "track"];
  const words = Array.from({ length: 25 }, () =>
    wordPool[Math.floor(Math.random() * wordPool.length)]
  );
  return words;
};
