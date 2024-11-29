"use client";

import { useState } from "react";
import HabitDetails from "@/components/Dashboard/Details";
import dynamic from "next/dynamic";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const HabitList = dynamic(() => import("@/components/Dashboard/Habit"), {
  ssr: false,
});

const HabitDashboardClient = ({ isMobile }: { isMobile?: boolean }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleHabitSelect = (habit: any) => {
    setSelectedHabit(habit);
    if (isMobile) {
      setIsDetailsOpen(true);
    }
  };

  return (
    <div className="flex h-full">
      <div
        className={`overflow-y-auto border-l border-r border-gray-700 ${!isMobile ? "w-1/2" : "w-full"}`}
      >
        <HabitList isMobile={isMobile} onHabitSelect={handleHabitSelect} />
      </div>

      {!isMobile && (
        <div className="w-1/2 overflow-y-auto">
          <HabitDetails habit={selectedHabit} />
        </div>
      )}

      {isMobile && (
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Habit Details</SheetTitle>
            </SheetHeader>
            <HabitDetails habit={selectedHabit} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default HabitDashboardClient;
