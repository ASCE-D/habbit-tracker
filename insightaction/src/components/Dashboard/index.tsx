"use client";

import { useState } from "react";
import HabitDetails from "@/components/Dashboard/Details";
import dynamic from "next/dynamic";

const HabitList = dynamic(() => import("@/components/Dashboard/Habit"), {
  ssr: false,
});

const HabitDashboardClient = () => {
  const [selectedHabit, setSelectedHabit] = useState(null);

  return (
    <>
      <div className="w-1/2 border-l border-r border-gray-700">
        <HabitList onHabitSelect={setSelectedHabit} />
      </div>
      <div className="w-1/2">
        <HabitDetails habit={selectedHabit} />
      </div>
    </>
  );
};

export default HabitDashboardClient;