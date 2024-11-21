"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Button } from "../ui/button";

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

const SortableItem = ({ habit }: { habit: HabitWithStats }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card p-4",
        "cursor-grab touch-none select-none active:cursor-grabbing",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-3">
        <GripVertical className="text-muted-foreground h-6 w-6 flex-shrink-0" />
        <span className="text-base font-medium">{habit.title}</span>
      </div>
    </div>
  );
};

const SimpleHabitList = ({ date, onClose }: { date: Date; onClose: any }) => {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Configure sensors with appropriate options for touch devices
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100, // Shorter delay for better responsiveness
        tolerance: 8, // Slightly increased tolerance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    // Lock scroll and add necessary styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Add touch handling styles
    const style = document.createElement("style");
    style.textContent = `
      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        overflow: hidden;
        touch-action: none;
        -webkit-tap-highlight-color: transparent;
      }
      .modal-content {
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }
      .sortable-item {
        touch-action: none !important;
        -webkit-touch-callout: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.overflow = originalStyle;
      style.remove();
    };
  }, []);

  const fetchCompletedHabits = async () => {
    setIsLoading(true);
    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

    try {
      const result = await getHabitsForDay(localDateString);
      if ("success" in result && result.success) {
        const typedResult = result as HabitDayResult;
        setHabits(typedResult.habits);
      }
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedHabits();
  }, [date]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveOrderToLocalStorage = () => {
    try {
      const orderIds = habits.map((item) => item.id);
      localStorage.setItem("habitsOrder", JSON.stringify(orderIds));
      onClose();
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent click from reaching elements behind the modal
    e.stopPropagation();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="modal-content w-full max-w-[600px]"
          onClick={handleModalClick}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : (
            <Card className="relative">
              <CardHeader>
                <CardTitle>Rearrange Habits</CardTitle>
                <CardDescription>
                  Touch and hold to drag habits into your preferred order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={habits}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {habits.map((habit) => (
                          <SortableItem key={habit.id} habit={habit} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 min-w-[100px] px-6 text-base"
                    onClick={() => !isDragging && onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-12 min-w-[100px] px-6 text-base"
                    onClick={() => !isDragging && saveOrderToLocalStorage()}
                  >
                    Save Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SimpleHabitList;
