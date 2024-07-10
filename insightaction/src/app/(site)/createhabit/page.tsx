// app/goals-and-habits/page.tsx

"use client";

import { useState } from "react";
// import { createGoal } from '@/app/actions/createGoal'
// import { createHabit } from '@/app/actions/createHabit'
import { createGoal, createHabit } from "@/actions/habit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GoalsAndHabitsPage() {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [currentGoalId, setCurrentGoalId] = useState("");
  const [habitData, setHabitData] = useState({
    title: "",
    description: "",
    cue: "",
    craving: "",
    response: "",
    reward: "",
    implementationIntention: "",
    environment: "",
    time: "",
    obstacleDescription: "",
    obstacleSolution: "",
  });

  const handleGoalSubmit = async (e: any) => {
    e.preventDefault();
    const result = await createGoal({
      title: goalTitle,
      description: goalDescription,
      currentPath: "/createhabit",
    });

    if (result.error) {
      console.error(result.error);
      // Handle error (e.g., show error message to user)
    } else {
      console.log("Goal created:", result.goal);
      setCurrentGoalId(result.goal?.id as string);
      // Reset form or show success message
      // setGoalTitle('')
      // setGoalDescription('')
    }
  };

  const handleHabitSubmit = async (e: any) => {
    e.preventDefault();
    if (!currentGoalId) {
      console.error("No goal selected");
      return;
    }

    const result = await createHabit({
      ...habitData,
      goalId: currentGoalId,
      time: new Date(habitData.time),
      obstacles: [
        {
          description: habitData.obstacleDescription,
          solution: habitData.obstacleSolution,
        },
      ],
      currentPath: "/createhabit",
    });

    if (result.error) {
      console.error(result.error);
      // Handle error (e.g., show error message to user)
    } else {
      console.log("Habit created:", result.habit);
      // Reset form or show success message
      setHabitData({
        title: "",
        description: "",
        cue: "",
        craving: "",
        response: "",
        reward: "",
        implementationIntention: "",
        environment: "",
        time: "",
        obstacleDescription: "",
        obstacleSolution: "",
      });
    }
  };

  const handleHabitChange = (e: any) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto my-8 px-6 py-16">
      <h1 className="my-6 text-3xl font-bold">Set Your Goals and Habits</h1>

      {/* Goal Form */}
      <form onSubmit={handleGoalSubmit} className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Create a New Goal</h2>
        <div className="mb-4">
          <Label
            htmlFor="goalTitle"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Goal Title
          </Label>
          <Input
            type="text"
            id="goalTitle"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="mt-1 block  rounded-md border-gray-300 px-2 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="goalDescription"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Goal Description
          </Label>
          <Textarea
            id="goalDescription"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            className="mt-1 block rounded-md border-gray-600 p-2 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Create Goal
        </Button>
      </form>

      {/* Habit Form */}
      {currentGoalId && (
        <form onSubmit={handleHabitSubmit}>
          <h2 className="mb-4 text-2xl font-semibold">
            Create a New Habit for Your Goal
          </h2>
          {Object.entries(habitData).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label
                htmlFor={key}
                className="block text-sm font-medium capitalize text-gray-700"
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              {key === "description" ? (
                <textarea
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleHabitChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <Input
                  type={key === "time" ? "datetime-local" : "text"}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleHabitChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required={key !== "description"}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Create Habit
          </button>
        </form>
      )}
    </div>
  );
}
