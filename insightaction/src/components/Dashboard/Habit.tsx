// components/HabitList.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  ArrowDownNarrowWide,
  CalendarIcon,
  GripVertical,
  MoreVertical,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddHabitModal } from "./Addhabit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Habit, HabitStatus } from "@prisma/client";
import { trackHabit, fetchHabits } from "@/actions/habit";
import { getHabitsForDay } from "@/actions/habit/test";
import PreLoader from "../Common/PreLoader";
import { EditHabitModal } from "./edithabit";
import dynamic from "next/dynamic";

const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false },
);
const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false },
);
const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false },
);

interface HabitListProps {
  initialHabits: Habit[];
}

type HabitWithStats = Habit & {
  status: string;
  completed: number;
  skipped: number;
  failed: number;
  streak: number;
  total: number;
  remainingCount: number;
};

interface HabitDayResult {
  success: boolean;
  habits: HabitWithStats[];
}

const HabitList: React.FC<any> = ({ onHabitSelect }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [tempCount, setTempCount] = useState(0);
  const [currentHabits, setCurrentHabits] = useState<HabitWithStats[]>([]);
  const [isClient, setIsClient] = useState(false);

  const handleCountStats = (goalCount: number, remainingCount: number) => {
    const displayCount = goalCount - remainingCount;
    setTempCount(displayCount);
  };

  const handleOpenChange = useCallback((habit: HabitWithStats) => {
    return (open: boolean) => {
      if (open) {
        // Perform actions when the popover opens
        handleCountStats(
          habit.goalCount as number,
          habit.remainingCount as number,
        );
        console.log("Popover opened");
      }
    };
  }, []);

  const incrementCount = (goalCount: number) => {
    if (tempCount < goalCount) {
      setTempCount((prev) => prev + 1);
    }
  };

  const decrementCount = (completedCount: number) => {
    if (tempCount > completedCount) {
      setTempCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, [date]);

  useEffect(() => {
    fetchCompletedHabits();
  }, [date]);

  useEffect(() => {
    setCurrentHabits(
      habits.filter((habit) => habit.status === HabitStatus.CURRENT),
    );
  }, [habits]);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const fetchCompletedHabits = async () => {
    setIsLoading(true);

    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const result = await getHabitsForDay(localDateString);
    console.log(date);
    console.log(localDateString, result);
    if ("success" in result && result.success) {
      const typedResult = result as HabitDayResult;
      setHabits(typedResult.habits);
      // setCurrentHabits(
      //   typedResult.habits.filter(
      //     (habit) => habit.status === HabitStatus.CURRENT,
      //   ),
      // );
      setIsLoading(false);
    } else {
      console.error("Failed to fetch completed habits:", result);
      setIsLoading(false);
    }
  };

  const handleHabitCompletion = async (
    habitId: string,
    status: HabitStatus,
    completed: boolean,
    completedCount?: number,
    partial = false,
  ) => {
    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    try {
      console.log(habitId, status, completedCount, partial);

      const result = await trackHabit({
        habitId,
        localDateString,
        completed,
        status,
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
          <span
            onClick={() => onHabitSelect(habit)}
            className="hover:cursor-pointer"
          >
            {habit.title}
          </span>
          <div className="flex items-center space-x-2">
            {habit.status === HabitStatus.CURRENT && (
              <button
                onClick={() =>
                  handleHabitCompletion(habit.id, HabitStatus.COMPLETED, true)
                }
                className="flex items-center rounded bg-black px-3 py-1 transition-colors duration-200 hover:bg-done"
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
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {habit.status === HabitStatus.CURRENT && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        handleHabitCompletion(
                          habit.id,
                          HabitStatus.SKIPPED,
                          false,
                        )
                      }
                    >
                      Skip
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleHabitCompletion(
                          habit.id,
                          HabitStatus.FAILED,
                          false,
                        )
                      }
                    >
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleHabitCompletion(
                          habit.id,
                          HabitStatus.COMPLETED,
                          true,
                        )
                      }
                    >
                      Done
                    </DropdownMenuItem>
                  </>
                )}
                {habit.status === HabitStatus.COMPLETED && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleHabitCompletion(
                        habit.id,
                        HabitStatus.CURRENT,
                        false,
                      )
                    }
                  >
                    Undo
                  </DropdownMenuItem>
                )}
                {habit.status === "SKIPPED" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleHabitCompletion(
                        habit.id,
                        HabitStatus.CURRENT,
                        false,
                      )
                    }
                  >
                    Undo Skip
                  </DropdownMenuItem>
                )}
                {habit.status === "FAILED" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleHabitCompletion(
                        habit.id,
                        HabitStatus.CURRENT,
                        false,
                      )
                    }
                  >
                    Undo Fail
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Show streak</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const items = Array.from(currentHabits);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setCurrentHabits(items);
      // Here you would typically update the order in your backend
      // updateHabitOrder(items.map(habit => habit.id));
    },
    [currentHabits],
  );

  const renderCurrentHabits = () => {
    if (!isClient) return null;
    return (
      <DragDropContext onDragEnd={onDragEnd} key={date.toISOString()}>
        <Droppable droppableId="habits">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "space-y-2 transition-colors duration-200",
                snapshot.isDraggingOver && "rounded-md bg-background p-2",
              )}
            >
              {currentHabits.map((habit, index) => (
                <Draggable
                  key={`${habit.id}-${date.toISOString()}`}
                  draggableId={`${habit.id}-${date.toISOString()}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "flex items-center justify-between rounded-md border-b border-gray-700 p-4 transition-all duration-200",
                        snapshot.isDragging && "bg-background shadow-lg",
                      )}
                    >
                      {/* Habit content */}
                      <div className="flex items-center space-x-3">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="text-gray-400" />
                        </div>
                        <span
                          onClick={() => onHabitSelect(habit)}
                          className="hover:cursor-pointer"
                        >
                          {habit.title}
                        </span>
                      </div>
                      {/* Habit actions */}
                      {/* ... (rest of the habit actions remain the same) */}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return isLoading ? (
    <PreLoader />
  ) : (
    <div className="bg-dark min-h-screen space-y-6 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant={"outline"}
            className={cn(
              "rounded-full bg-gray-700 p-4",
              !date && "text-muted-foreground",
            )}
          >
            Searh <Search className="ml-2 h-4 w-4 text-primaryOrange" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "rounded-full bg-gray-700 p-4",
                  !date && "text-muted-foreground",
                )}
              >
                {isToday(date) ? "Today" : date.toLocaleDateString()}{" "}
                <CalendarIcon className="ml-2 h-4 w-4" />{" "}
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
          <Button
            variant={"outline"}
            className={cn(
              "rounded-full bg-gray-700 p-4",
              !date && "text-muted-foreground",
            )}
          >
            <ArrowDownNarrowWide className="h-6 w-6 bg-primaryOrange" />
          </Button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primaryOrange px-2 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="pl-2">Set Habit</span>
          <span className="px-2">+</span>
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <AddHabitModal
            onClose={() => {
              setIsModalOpen(false);
              fetchCompletedHabits();
            }}
          />
        </div>
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}

      {/* Current Habits */}
      {renderCurrentHabits()}

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
                    <span
                      className="line-through hover:cursor-pointer"
                      onClick={() => onHabitSelect(habit)}
                    >
                      {habit.title}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleHabitCompletion(
                              habit.id,
                              HabitStatus.CURRENT,
                              false,
                            )
                          }
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
      {habits.filter((habit: any) => habit.status === "SKIPPED").length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="skipped-habits">
            <AccordionTrigger>Skipped Habits</AccordionTrigger>
            <AccordionContent>
              {renderHabitList(
                habits.filter((habit: any) => habit.status === "SKIPPED"),
                "text-gray-400",
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Failed Habits */}
      {habits.filter((habit: any) => habit.status === "FAILED").length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="failed-habits">
            <AccordionTrigger>Failed Habits</AccordionTrigger>
            <AccordionContent>
              {renderHabitList(
                habits.filter((habit: any) => habit.status === "FAILED"),
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
