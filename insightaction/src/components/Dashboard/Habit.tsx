// components/HabitList.tsx

"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddHabitModal } from "./Addhabit";
import { Habit, HabitStatus } from "@prisma/client";
import { trackHabit, getCompletedHabits } from "@/actions/habit";

interface HabitListProps {
  habits: Habit[] ;
}

interface CompletedHabit {
  habit: Habit;
  date: Date;
}

const HabitList: React.FC<any> = ({ habits }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedHabits, setCompletedHabits] = useState<CompletedHabit[]>([]);

  useEffect(() => {
    fetchCompletedHabits();
  }, [date]);

  const fetchCompletedHabits = async () => {
    const result = await getCompletedHabits(date);
    if ("success" in result && result.success) {
      setCompletedHabits(result.completedHabits);
    } else {
      console.error("Failed to fetch completed habits:", result.error);
    }
  };

  const handleHabitCompletion = async (habitId: string) => {
    try {
      const result = await trackHabit({
        habitId,
        date,
        completed: true,
        status: HabitStatus.COMPLETED,
      });

      if ("error" in result) {
        console.error("Error tracking habit:", result.error);
      } else {
        console.log("Habit tracked successfully:", result.trackedHabit);
        fetchCompletedHabits();
      }
    } catch (error) {
      console.error("Error tracking habit:", error);
    }
  };

  const isHabitCompleted = (habitId: string) => {
    return completedHabits.some(
      (completedHabit) => completedHabit.habit.id === habitId,
    );
  };

  return (
    <div className="bg-dark min-h-screen space-y-6 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button className="rounded-full bg-gray-700 p-2">🔍</button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "rounded-full bg-gray-700 p-2",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <button className="rounded-full bg-gray-700 p-2">🔽</button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primaryOrange px-2 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="pl-2">Set Goal</span>
          <span className="px-2">+</span>
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <AddHabitModal onClose={() => setIsModalOpen(false)} />
        </div>
      )}
      <div className="space-y-0">
        {
         
          habits.map((habit: any, index: any) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-4 ${
               
                index !== habits.length - 1 ? "border-b border-gray-700" : ""
              }`}
            >
              <span
                className={isHabitCompleted(habit.id) ? "line-through" : ""}
              >
                {habit.title}
              </span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleHabitCompletion(habit.id)}
                  className={`flex items-center rounded px-3 py-1 transition-colors duration-200 hover:bg-done ${
                    isHabitCompleted(habit.id) ? "bg-green-700" : "bg-black"
                  }`}
                >
                  <span className="mr-2">Done</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Skip</DropdownMenuItem>
                    <DropdownMenuItem>Show streak</DropdownMenuItem>
                    <DropdownMenuItem>Failed</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Done</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        }
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Completed Habits</h2>
        <ul className="space-y-2">
          {completedHabits.map((completedHabit) => (
            <li key={completedHabit.habit.id} className="line-through">
              {completedHabit.habit.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HabitList;