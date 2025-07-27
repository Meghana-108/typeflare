// src/components/ResultPanel.jsx
const ResultPanel = ({ stats }) => (
  <div className="text-center mt-6">
    <h2 className="text-2xl font-semibold text-green-400">Test Complete 🎉</h2>
    <p className="mt-2 text-white">WPM: {stats.wpm}</p>
    <p className="text-white">Raw WPM: {stats.rawWPM}</p>
    <p className="text-white">Accuracy: {stats.accuracy}%</p>
  </div>
);

export default ResultPanel;
