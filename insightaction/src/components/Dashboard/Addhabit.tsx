import React, { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createHabit } from "@/actions/habit"; // Assume this is where createHabit function is exported

export function AddHabitModal({
  className,
  onClose,
  ...props
}:any) {
  const [habitData, setHabitData] = useState({
    title: "",
    description: "",
    
    implementationIntention: "",
    environment: "",
    time: new Date(),
    stackedHabitId: "",
    obstacles: [{ description: "", solution: "" }],
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleObstacleChange = (index:any, field: any, value:any) => {
    const newObstacles = [...habitData.obstacles];
    //@ts-ignore
    newObstacles[index ][field] = value;
    setHabitData((prev) => ({ ...prev, obstacles: newObstacles }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // Create a new object without the stackedHabitId if it's empty
      const dataToSend = {...habitData};
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

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
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
          {/* Add more fields here for goalId, cue, craving, response, reward, etc. */}
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
              onChange={(e) => setHabitData((prev) => ({ ...prev, time: new Date(e.target.value) }))}
            />
          </div>
          {/* Add fields for obstacles */}
          {habitData.obstacles.map((obstacle, index) => (
            <div key={index} className="grid gap-2">
              <Label>Obstacle {index + 1}</Label>
              <Input
                placeholder="Description"
                value={obstacle.description}
                onChange={(e) => handleObstacleChange(index, 'description', e.target.value)}
              />
              <Input
                placeholder="Solution"
                value={obstacle.solution}
                onChange={(e) => handleObstacleChange(index, 'solution', e.target.value)}
              />
            </div>
          ))}
          <Button type="button" onClick={() => setHabitData((prev) => ({ ...prev, obstacles: [...prev.obstacles, { description: "", solution: "" }] }))}>
            Add Obstacle
          </Button>
          <div className="grid gap-2">
          <Label htmlFor="stackedHabitId">Stacked Habit ID (optional)</Label>
          <Input
            id="stackedHabitId"
            name="stackedHabitId"
            placeholder="ID of the habit to stack on"
            value={habitData.stackedHabitId}
            onChange={handleInputChange}
          />
        </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Habit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}