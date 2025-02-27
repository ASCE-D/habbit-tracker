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
import { Calendar, Flag, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { priority } from "@prisma/client";

interface AddTodoModalProps {
  onClose: () => void;
  onAddTodo?: (todo: any) => void;
}

export function AddTodoModal({ onClose, onAddTodo }: AddTodoModalProps) {
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    priority: "p3" as priority,
    // deadline: "",
    // hasDeadline: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTodoData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (priority: priority) => {
    setTodoData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoData.title.trim()) {
      toast.error("Please enter a title for your todo");
      return;
    }

    console.log("Todo data to send:", todoData);
    if (onAddTodo) onAddTodo(todoData);
    toast.success("Todo added successfully");
    onClose();
  };

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <Card
          className={cn(
            "glass-morphism max-h-[90vh] w-[600px] overflow-y-auto",
          )}
        >
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-gradient text-2xl font-bold">
              Add New Todo
            </CardTitle>
            <CardDescription>Create a new task to complete.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Todo Title</Label>
                <Input
                  name="title"
                  placeholder="e.g., Complete project proposal"
                  value={todoData.title}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  placeholder="Add more details about this task..."
                  value={todoData.description}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handlePriorityChange("p3")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all ${
                      todoData.priority === "p3"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10"
                    }`}
                  >
                    <Flag className="h-5 w-5 text-green-500" />
                    <span
                      className={
                        todoData.priority === "p3"
                          ? "font-medium text-green-700 dark:text-green-300"
                          : ""
                      }
                    >
                      Low
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePriorityChange("p2")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all ${
                      todoData.priority === "p2"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                    }`}
                  >
                    <Flag className="h-5 w-5 text-amber-500" />
                    <span
                      className={
                        todoData.priority === "p2"
                          ? "font-medium text-amber-700 dark:text-amber-300"
                          : ""
                      }
                    >
                      Medium
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePriorityChange("p1")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all ${
                      todoData.priority === "p1"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-border hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                    }`}
                  >
                    <Flag className="h-5 w-5 text-red-500" />
                    <span
                      className={
                        todoData.priority === "p1"
                          ? "font-medium text-red-700 dark:text-red-300"
                          : ""
                      }
                    >
                      High
                    </span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border/40 pb-4 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="transition-all duration-200 hover:bg-accent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white transition-all duration-200 hover:opacity-90"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Todo
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>,
    document.body,
  );
}
