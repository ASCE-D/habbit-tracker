import React from "react";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 space-y-8 bg-gray-900  p-6 text-white">
      <h1 className="text-2xl font-bold">My Habits</h1>
      <nav className="space-y-4">
        <a href="#" className="block hover:text-gray-300">
          Dashboard
        </a>
        <a href="#" className="block hover:text-gray-300">
          All Habits
        </a>
        <a href="#" className="block hover:text-gray-300">
          Statistics
        </a>
        <a href="#" className="block hover:text-gray-300">
          Settings
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
