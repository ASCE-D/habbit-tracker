"use client";

import React, { useState } from "react";
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

const HabitList = () => {
  const habits = [
    { id: 1, name: "Morning Meditation", completion: "80%" },
    { id: 2, name: "Read 30 minutes", completion: "65%" },
    { id: 3, name: "Exercise", completion: "90%" },
  ];

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <button className="rounded-full bg-gray-700 p-2">🔽</button>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="focus-visible:ring-ring bg-primaryOrange text-primary-foreground hover:bg-primary/90 inline-flex h-9  items-center justify-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50">
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
        {habits.map((habit, index) =>
          habit && habit.name ? (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-4 ${
                index !== habits.length - 1 ? "border-b border-gray-700" : ""
              }`}
            >
              <span>{habit.name}</span>
              <div className="flex items-center space-x-4">
                <button className="hover:bg-done flex items-center rounded bg-black px-3 py-1 transition-colors duration-200">
                  <span className="mr-2 ">Done</span>
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
          ) : null,
        )}
      </div>
    </div>
  );
};

export default HabitList;
