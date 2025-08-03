const Navbar = () => (
  <nav className="w-full flex items-center justify-between p-4 bg-[#111] text-white">
    <div className="text-green-400 font-bold text-xl flex items-center gap-2">
      <div className="bg-green-400 text-black px-2 py-1 rounded-full">T</div>
      TypeMaster
    </div>
    <div className="flex gap-6 items-center text-sm">
      <button className="hover:text-green-400">Test</button>
      <button className="hover:text-green-400">Stats</button>
      <button className="hover:text-green-400">Leaderboard</button>
      <button className="hover:text-green-400">Profile</button>
      <button className="text-xl">🌗</button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">U</div>
        <span>User2738</span>
      </div>
    </div>
  </nav>
);
