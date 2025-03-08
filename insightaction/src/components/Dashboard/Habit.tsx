// components/HabitList.tsx

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Flag,
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
import { Habit, HabitStatus, Todo } from "@prisma/client";
import { trackHabit, fetchHabits, deleteHabit } from "@/actions/habit";
import {
  addTodo,
  deleteTodo,
  getHabitsForDay,
  getTodos,
  markTodo,
  updateTodo,
} from "@/actions/habit/test";
import PreLoader from "../Common/PreLoader";
import { EditHabitModal } from "./edithabit";
import dynamic from "next/dynamic";
import SimpleHabitList from "./DragTest";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AddTodoModal } from "./AddTodo";
import Loader from "../Common/Loader";

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
const MAX_HABITS = 5;

const HabitList: React.FC<any> = ({ onHabitSelect, isMobile }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [tempCount, setTempCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [sortingEnabled, setSortingEnabled] = useState(false);
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [habitCount, setHabitCount] = useState(0);
  const [activeTab, setActiveTab] = useState("habits");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);

  // const router = useRouter();
  let preferenceOrder: HabitWithStats[] = [];
  const preferenceOrderString = localStorage.getItem("habitsOrder");
  if (preferenceOrderString !== null) {
    preferenceOrder = JSON.parse(preferenceOrderString);
  }

  // useEffect(() => {
  //   setHabits(preferenceOrder);
  // });

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

  const handleTodoComplete = async (todoId: string) => {
    console.log("Todo completed:", todoId);
    const res = await markTodo(todoId);
    if (res.success) {
      toast("Todo marked as completed");
      playCompletionSound();
      fetchTodos();
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, [date]);

  useEffect(() => {
    fetchCompletedHabits();
    fetchTodos();
  }, [date]);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    const res = await getTodos();

    if (res.success) {
      console.log(res.todos);
      setTodos(res.todos);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.error("Failed to fetch todos:", res);
    }
  };

  const fetchCompletedHabits = async () => {
    setIsLoading(true);

    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const result = await getHabitsForDay(localDateString);
    console.log(date);
    console.log(localDateString, result);

    if ("success" in result && result.success) {
      const typedResult = result as HabitDayResult;

      // Get the order from localStorage
      const orderIds = getOrderFromLocalStorage();

      // Sort the habits based on the order
      const sortedHabits = typedResult.habits.sort((a, b) => {
        const indexA = orderIds.indexOf(a.id);
        const indexB = orderIds.indexOf(b.id);

        // If an id is not in the order array, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });
      setHabitCount(sortedHabits.length);
      setHabits(sortedHabits);
      setIsLoading(false);
    } else {
      console.error("Failed to fetch completed habits:", result);
      setIsLoading(false);
    }
  };

  // Helper function to get the order from localStorage
  const getOrderFromLocalStorage = () => {
    const orderString = localStorage.getItem("habitsOrder");
    return orderString ? JSON.parse(orderString) : [];
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio("/audio/thu-sep-26-2024_L8LUERVy.mp3");
  }, []);

  const handleDeleteTodo = async (id: string) => {
    const res = await deleteTodo(id);
    if (res.success) {
      toast("Todo deleted");
      fetchTodos();
    } else {
      console.error("Failed to delete todo:", res);
    }
  };

  const playCompletionSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
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

    // Optimistically update the UI
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, status } : habit,
      ),
    );
    // Play sound effect if the habit is being marked as completed
    if (status === HabitStatus.COMPLETED) {
      playCompletionSound();
    }

    try {
      const result = await trackHabit({
        habitId,
        localDateString,
        completed,
        status,
      });

      if ("error" in result) {
        console.error("Error tracking habit:", result.error);
        // Revert the optimistic update if there's an error
        fetchCompletedHabits();
      } else {
        console.log("Habit tracked successfully:", result.trackedHabit);
        // The UI is already updated, so we don't need to do anything here
      }
    } catch (error) {
      console.error("Error tracking habit:", error);
      // Revert the optimistic update if there's an error
      fetchCompletedHabits();
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      const result = await deleteHabit(habitId);
      if (result.success) {
        // Remove the habit from the local state
        setHabits((prevHabits) =>
          prevHabits.filter((habit) => habit.id !== habitId),
        );
        fetchCompletedHabits();
      } else {
        alert("Failed to delete habit. Please try again.");
      }
    }
  };

  const renderHabitList = (filteredHabits: any, itemClassName = "") => {
    const sortedHabits = filteredHabits.sort((a: any, b: any) => {
      return preferenceOrder.indexOf(a.id) - preferenceOrder.indexOf(b.id);
    });

    return (
      <div className="space-y-0">
        {sortedHabits.map((habit: any, index: any) => (
          <div
            key={habit.id}
            className={`flex items-center justify-between p-4 ${
              index !== filteredHabits.length - 1
                ? "border-b border-gray-700"
                : ""
            } ${itemClassName}`}
          >
            <div className="flex flex-col">
              <span
                onClick={() => onHabitSelect(habit)}
                className="hover:cursor-pointer"
              >
                {habit.title}
              </span>
              <span className="m-1 text-sm text-gray-500">
                {habit.environment}
              </span>
            </div>
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
                  <DropdownMenuItem onClick={() => handleDeleteHabit(habit.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTodoList = () => {
    // Split todos into completed and non-completed
    const completedTodos = todos.filter((todo) => todo.isCompleted);
    const activeTodos = todos.filter((todo) => !todo.isCompleted);

    // Function to render a todo item with proper priority styling
    // @ts-ignore
    const renderTodoItem = (todo, index, list) => {
      // Priority flag colors
      const priorityColors = {
        p1: "text-red-500",
        p2: "text-amber-500",
        p3: "text-green-500",
      };

      // Border style for list items
      const borderClass =
        index !== list.length - 1 ? "border-b border-gray-700" : "";

      return (
        <div
          key={todo.id}
          className={`flex items-center justify-between p-4 ${borderClass}`}
        >
          <div className="flex flex-col">
            <div className="flex items-center">
              <Flag
                className={`mr-2 h-4 w-4 ${priorityColors[todo.priority as keyof typeof priorityColors]}`}
              />
              <span
                className={`${todo.isCompleted ? "line-through" : ""} ${priorityColors[todo.priority as keyof typeof priorityColors]}`}
              >
                {todo.title}
              </span>
            </div>
            {todo.description && (
              <span className="m-1 ml-6 mr-4 text-sm text-gray-500">
                {todo.description}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!todo.isCompleted && (
              <button
                onClick={() => handleTodoComplete(todo.id)}
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
                {/* {todo.isCompleted ? (
                <DropdownMenuItem
                  onClick={() => handleTodoCompletion(todo.id)}
                >
                  Undo
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleTodoCompletion(todo.id)}
                >
                  Complete
                </DropdownMenuItem>
              )} */}
                <DropdownMenuItem onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Active todos */}
        <div className="space-y-0">
          {activeTodos.map((todo, index) =>
            renderTodoItem(todo, index, activeTodos),
          )}
        </div>

        {/* Completed todos in an accordion */}
        {completedTodos.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem
              value="completed-todos"
              className="border-t border-gray-700"
            >
              <AccordionTrigger className="px-4 py-3">
                Completed Todos ({completedTodos.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-0 pt-0">
                <div className="space-y-0">
                  {completedTodos.map((todo, index) =>
                    renderTodoItem(todo, index, completedTodos),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    );
  };

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const handleAddTodo = async (data: Partial<Todo>) => {
    const res = await addTodo(data);
    if (res.success) {
      toast.success("Todo added successfully");

      fetchTodos();
    } else {
      toast.error("failed to add todo");
      console.error("Failed to add todo:", res.error);
    }
  };

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      {" "}
      {/* h-screen makes it full viewport height */}
      <Loader />
    </div>
  ) : (
    <div className="bg-dark min-h-screen space-y-6 p-4 text-white">
      <Tabs
        defaultValue="habits"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        {isModalOpen && habitCount < MAX_HABITS && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <AddHabitModal
              onClose={() => {
                setIsModalOpen(false);
                fetchCompletedHabits();
              }}
            />
          </div>
        )}

        {/* 
<div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            Habits: {habitCount}/{MAX_HABITS}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primaryOrange px-2 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              habitCount >= MAX_HABITS && "opacity-50 cursor-not-allowed"
            )}
            disabled={habitCount >= MAX_HABITS}
          >
            <span className="pl-2">Set Habit</span>
            <span className="px-2">+</span>
          </button>
        </div>
      </div> */}

        {editingHabit && (
          <EditHabitModal
            habit={editingHabit}
            onClose={() => setEditingHabit(null)}
          />
        )}

        {addTodoModalOpen && (
          <AddTodoModal
            onClose={() => {
              setAddTodoModalOpen(false);
            }}
            onAddTodo={(data) => handleAddTodo(data)}
          />
        )}

        <TabsContent value="habits" className="mt-0">
          {" "}
          <div className="flex items-center justify-between">
            <div className={`flex space-x-4 ${isMobile ? " ml-10" : ""}`}>
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
                    <CalendarIcon className="ml-2 h-4 w-4 text-primaryOrange" />{" "}
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
              {/* <Button
            variant={"outline"}
            className={cn(
              "rounded-full bg-gray-700 p-4",
              !date && "text-muted-foreground",
              sortingEnabled && "bg-primaryOrange",
            )}
            onClick={() => setSortingEnabled(!sortingEnabled)}
          >
            <ArrowDownNarrowWide className="h-6 w-6" />
          </Button> */}
            </div>

            <div className="flex items-center space-x-4 ">
              <span className="text-sm text-gray-400">
                Habits: {habitCount}/{MAX_HABITS}
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  "text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primaryOrange px-2 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  habitCount >= MAX_HABITS && "cursor-not-allowed opacity-50",
                )}
                disabled={habitCount >= MAX_HABITS}
              >
                <span className="pl-2">Set Habit</span>
                <span className="px-2">+</span>
              </button>
            </div>
          </div>
          {/* Current Habits */}
          {renderHabitList(
            habits.filter((habit: any) => habit.status === HabitStatus.CURRENT),
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
          {habits.filter((habit: any) => habit.status === "SKIPPED").length >
            0 && (
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
          {habits.filter((habit: any) => habit.status === "FAILED").length >
            0 && (
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
        </TabsContent>
        <TabsContent value="todos" className="mt-0">
          <div className=" flex justify-end">
            <button
              onClick={() => setAddTodoModalOpen(true)}
              className="text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primaryOrange px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Add Todo +
            </button>
          </div>
          {renderTodoList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitList;
