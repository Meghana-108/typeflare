const StatCard = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center bg-[#1c1c1c] p-6 rounded-xl w-40 border border-gray-700">
    <span className="text-green-400 text-2xl font-bold">{value}</span>
    <span className="text-white text-sm">{label}</span>
  </div>
);

const StatsPanel = () => (
  <div className="flex justify-center gap-8 my-6">
    <StatCard label="WPM" value="0" />
    <StatCard label="Raw WPM" value="0" />
    <StatCard label="Accuracy" value="0%" />
  </div>
);
