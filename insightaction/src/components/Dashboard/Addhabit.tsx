import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createHabit } from "@/actions/habit";

//@ts-ignore
export function AddHabitModal({ onClose }) {
  const [habitData, setHabitData] = useState({
    title: "",
    description: "",
    implementationIntention: "",
    environment: "",
    time: new Date(),
    stackedHabitId: "",
    obstacles: [{ description: "", solution: "" }],
  });
  //@ts-ignore

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({ ...prev, [name]: value }));
  };
  //@ts-ignore

  const handleObstacleChange = (index, field, value) => {
    const newObstacles = [...habitData.obstacles];
    //@ts-ignore
    newObstacles[index][field] = value;
    setHabitData((prev) => ({ ...prev, obstacles: newObstacles }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const dataToSend = { ...habitData };
      if (!dataToSend.stackedHabitId) {
        //@ts-ignore

        delete dataToSend.stackedHabitId;
      }

      const result = await createHabit(dataToSend);
      if (result.success) {
        console.log("Habit created successfully:", result.habit);
        onClose();
      } else {
        console.error("Failed to create habit:", result.error);
      }
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <Card className={cn("w-[600px]")}>
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
            <CardDescription>Create a new habit to track.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Habit Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Read for 30 minutes"
                  value={habitData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your habit"
                  value={habitData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="environment">Environment</Label>
                <Input
                  id="environment"
                  name="environment"
                  placeholder="Where will you perform this habit?"
                  value={habitData.environment}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="datetime-local"
                  value={habitData.time.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setHabitData((prev) => ({
                      ...prev,
                      time: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              {/* {habitData.obstacles.map((obstacle, index) => (
                <div key={index} className="grid gap-2">
                  <Label>Obstacle {index + 1}</Label>
                  <Input
                    placeholder="Description"
                    value={obstacle.description}
                    onChange={(e) =>
                      handleObstacleChange(index, "description", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Solution"
                    value={obstacle.solution}
                    onChange={(e) =>
                      handleObstacleChange(index, "solution", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setHabitData((prev) => ({
                    ...prev,
                    obstacles: [
                      ...prev.obstacles,
                      { description: "", solution: "" },
                    ],
                  }))
                }
              >
                Add Obstacle
              </Button> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant={"orange"}>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Habit
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>,
    document.body,
  );
}
