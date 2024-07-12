"use client"

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HabitList from "./Habit";
import HabitDetails from "./Details";


const Layout = () => {
  const [selectedHabit, setSelectedHabit] = useState(null);

  return (
    <div className="mt-24 flex h-screen bg-gray-900 text-white">
      {/* Sidebar - 20% width */}
      <div className=" w-1/6">
        <Sidebar />
      </div>

      {/* Habit List - 40% width */}
      <div className="w-3/6 border-l border-r border-gray-700">
        <HabitList />
      </div>

      {/* Habit Details - 40% width */}
      <div className="w-2/6">
        <HabitDetails  />
      </div>
    </div>
  );
};

export default Layout;
