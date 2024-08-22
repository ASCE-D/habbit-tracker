"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { Habit } from "@prisma/client";
import { getHabitsForDay } from "@/actions/habit/test";
import ReactDOM from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CheckmarkAnimation from "../Common/CheckmarkAnimation";

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

// Update the component to receive `date` as a prop
const SimpleHabitList = ({ date, onClose }: { date: Date; onClose: any }) => {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCompletedHabits = async () => {
    setIsLoading(true);

    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
    const result = await getHabitsForDay(localDateString);
    console.log(date); // Debug: Check the current date
    console.log(localDateString, result); // Debug: Check the backend response
    if ("success" in result && result.success) {
      const typedResult = result as HabitDayResult;
      setHabits(typedResult.habits);
      console.log("Habits updated:", typedResult.habits); // Debug: Check the updated habits
      setIsLoading(false);
    } else {
      console.error("Failed to fetch completed habits:", result);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedHabits();
  }, [date]); // Refetch habits when the date changes

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHabits(items);
  };

  const saveOrderToLocalStorage = () => {
    setIsLoading(true);

    const orderIds = habits.map((item) => item.id);
    localStorage.setItem("habitsOrder", JSON.stringify(orderIds));

    setIsLoading(false);
    onClose();
  };
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Card className={cn("w-[600px]")}>
            <CardHeader>
              <CardTitle>Rearrange Habits</CardTitle>
              <CardDescription>Stack your habits in order.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 overflow-y-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="habits">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ listStyleType: "none", padding: 0 }}
                    >
                      {habits.map((habit, index) => (
                        <Draggable
                          key={habit.id}
                          draggableId={habit.id}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "flex items-center justify-between rounded-md border-b border-gray-700 p-4 transition-all duration-200",
                                isEditing && "bg-background shadow-lg",
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                {isEditing && (
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="text-gray-400" />
                                  </div>
                                )}
                                <span className="hover:cursor-pointer">
                                  {habit.title}
                                </span>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              {/* <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Done Rearranging" : "Rearrange Habits"}
              </button> */}
              {!isEditing && (
                <button onClick={saveOrderToLocalStorage}>Save Order</button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>,
    document.body,
  );
};

export default SimpleHabitList;
