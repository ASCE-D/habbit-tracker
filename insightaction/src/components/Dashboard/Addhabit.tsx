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

type CardProps = React.ComponentProps<typeof Card>;

export function AddHabitModal({
  className,
  onClose,
  ...props
}: CardProps & { onClose: () => void }) {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle habit creation logic here
    console.log("New habit:", { name: habitName, frequency });
    onClose();
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
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              placeholder="e.g., Read for 30 minutes"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
  );
}
