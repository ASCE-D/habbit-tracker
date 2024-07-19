// components/HabitList.tsx

"use client";

import React, { useState, useEffect } from "react";
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
import { CalendarIcon, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddHabitModal } from "./Addhabit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Habit, HabitStatus } from "@prisma/client";
import { trackHabit,  fetchHabits, getHabitsForDay } from "@/actions/habit";


interface HabitListProps {
  initialHabits: Habit[];
}

type HabitWithStats = Habit & {
  status: string;

  completed: number;
  skipped: number;
  failed: number;
};




const HabitList: React.FC<any> = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);

  const handleHabitSkip = (id: any) => {};
  const handleHabitFail = (id: any) => {};
  const handleHabitUncomplete = (id: any) => {};
  const handleHabitUnskip = (id: any) => {};
  const handleHabitUnfail = (id: any) => {};

  useEffect(() => {
    fetchCompletedHabits();
  }, [date]);

  const fetchCompletedHabits = async () => {
    const result = await getHabitsForDay(date);
    console.log (result)
    if ("success" in result && result.success) {
      setHabits(result.gethabit);
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



  const renderHabitList = (filteredHabits: any, itemClassName = "") => (
    <div className="space-y-0">
      {filteredHabits.map((habit: any, index: any) => (
        <div
          key={habit.id}
          className={`flex items-center justify-between p-4 ${
            index !== filteredHabits.length - 1
              ? "border-b border-gray-700"
              : ""
          } ${itemClassName}`}
        >
          <span>{habit.title}</span>
          <div className="flex items-center space-x-2">
            {habit.status === "NOT_STARTED" && (
              <button
                onClick={() => handleHabitCompletion(habit.id)}
                className="flex items-center rounded bg-black px-3 py-1 transition-colors duration-200 hover:bg-done"
              >
                 <button
                onClick={() => handleHabitCompletion(habit.id)}
                className="flex items-center rounded bg-black px-3 py-1 transition-colors duration-200 hover:bg-done"
              ></button>
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
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {habit.status === "current" && (
                  <>
                    <DropdownMenuItem onClick={() => handleHabitSkip(habit.id)}>
                      Skip
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleHabitFail(habit.id)}>
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleHabitCompletion(habit.id)}
                    >
                      Done
                    </DropdownMenuItem>
                  </>
                )}
                {habit.status === "completed" && (
                  <DropdownMenuItem
                    onClick={() => handleHabitUncomplete(habit.id)}
                  >
                    Undo
                  </DropdownMenuItem>
                )}
                {habit.status === "skipped" && (
                  <DropdownMenuItem onClick={() => handleHabitUnskip(habit.id)}>
                    Undo Skip
                  </DropdownMenuItem>
                )}
                {habit.status === "failed" && (
                  <DropdownMenuItem onClick={() => handleHabitUnfail(habit.id)}>
                    Undo Fail
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Show streak</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-dark min-h-screen space-y-6 p-4 text-white">
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
      {/* Current Habits */}
      {renderHabitList(
  habits.filter((habit: any) => 
    
    habit.status.toLowerCase() === "not_started"
  ),
)}

      {/* Completed Habits */}
      {habits.filter((habit: any) => habit.status === "COMPLETED").length >
        0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="completed-habits">
            <AccordionTrigger>Completed Habits</AccordionTrigger>
            <AccordionContent>
              {habits
                .filter((habit: any) => habit.status === "COMPLETED")
                .map((habit: any, index: any, filteredHabits: any) => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== filteredHabits.length - 1
                        ? "border-b border-gray-700"
                        : ""
                    }`}
                  >
                    <span className="line-through">{habit.title}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleHabitUncomplete(habit.id)}
                        >
                          Undo
                        </DropdownMenuItem>
                        <DropdownMenuItem>Show streak</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Skipped Habits */}
      {habits.filter((habit: any) => habit.status === "skipped").length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="skipped-habits">
            <AccordionTrigger>Skipped Habits</AccordionTrigger>
            <AccordionContent>
              {renderHabitList(
                habits.filter((habit: any) => habit.status === "skipped"),
                "text-gray-400",
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Failed Habits */}
      {habits.filter((habit: any) => habit.status === "failed").length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="failed-habits">
            <AccordionTrigger>Failed Habits</AccordionTrigger>
            <AccordionContent>
              {renderHabitList(
                habits.filter((habit: any) => habit.status === "failed"),
                "text-red-500",
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default HabitList;
