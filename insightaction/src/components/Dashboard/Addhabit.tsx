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
import { Calendar, Hash, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createHabit } from "@/actions/habit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FrequencyType } from "@prisma/client";

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
  const [count, setCount] = useState("1");
  const [unit, setUnit] = useState<FrequencyType>(FrequencyType.DAILY);

  const getExplanationText = () => {
    if (!count || !unit) return "";

    const countNum = parseInt(count, 10);
    if (isNaN(countNum) || countNum <= 0) return "";

    const unitMap: Record<FrequencyType, string> = {
      [FrequencyType.DAILY]: "day",
      [FrequencyType.WEEKLY]: "week",
      [FrequencyType.MONTHLY]: "month",
      [FrequencyType.INTERVAL]: "year", 
    };

    const unitString = unitMap[unit];
    const timeString = countNum === 1 ? unitString : unitString + "s";

    return `${countNum} time${countNum !== 1 ? "s" : ""} a ${timeString}`;
  };

  //@ts-ignore
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...habitData,
        count: parseInt(count, 10),
        frequency: unit,
        
      };
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
              <div className="flex gap-2">
                <div className="w-3/5">
                  <Label htmlFor="environment">Environment</Label>
                  <Input
                    id="environment"
                    name="environment"
                    placeholder="Where will you perform this habit?"
                    value={habitData.environment}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="w-2/5">
                  <Label htmlFor="time" className="pl-1">
                    Start Date
                  </Label>
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
                    className="mt-1 hover:cursor-default"
                  />
                </div>
              </div>
              <div className="space-y-6 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="count"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>Count</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="count"
                        name="count"
                        type="number"
                        placeholder="How many times?"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        className="pl-8"
                      />
                      <Hash className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="unit"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Frequency</span>
                    </Label>
                    <Select
                      value={unit}
                      onValueChange={(value) => setUnit(value as FrequencyType)}
                    >
                      <SelectTrigger className="relative pl-8">
                        <Calendar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999]">
                        <SelectItem value={FrequencyType.DAILY}>Day</SelectItem>
                        <SelectItem value={FrequencyType.WEEKLY}>
                          Week
                        </SelectItem>
                        <SelectItem value={FrequencyType.MONTHLY}>
                          Month
                        </SelectItem>
                        {/* <SelectItem value={FrequencyType.YEARLY}>
                          Year
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {getExplanationText()}
                </p>
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
      </div>
    </>,
    document.body,
  );
}
