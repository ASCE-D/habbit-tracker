"use client";

import React, { useEffect, useState } from "react";
import {
  Flame,
  Check,
  X,
  ArrowRight,
  ArrowUp,
  Share2,
  Edit,
  MoreHorizontal,
  ListCollapse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { getHabitPerformedDates } from "@/actions/habit";
import { useRouter } from "next/navigation";
import { EditHabitModal } from "./edithabit";
import ObstacleItem from "./ObstacleListCard";
import {
  deleteHabitObstacle,
  updateHabitObstacle,
  updateHabitObstacleById,
} from "@/actions/habit/test";
import e from "express";
import { set } from "date-fns";

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-dark rounded-lg border border-gray-600 p-4">
    <div className="mb-2 flex items-center text-gray-400">
      {Icon && <Icon size={16} className={`mr-2 ${color}`} />}
      <span className="text-xs uppercase">{title}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {subtext && <div className={`text-sm ${color}`}>{subtext}</div>}
  </div>
);

export default function HabitDetails({ habit }: { habit: any | null }) {
  const [date, setDate] = useState(new Date());
  const [performedDates, setPerformedDates] = useState<Date[]>([]);
  const [isEditOpen, setIsEdit] = useState(false);
  const [obstacle, setObstacles] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (habit?.obstacles) {
      setObstacles(habit.obstacles);
    }
  }, [habit]);

  const handleShare = () => {
    if (habit?.id) {
      router.push(`/share/${habit.id}`);
    }
  };

  const handleObstacleSave = async (
    obstacleId: string,
    description?: string,
    solution?: string,
  ) => {
    const updateObstacle = await updateHabitObstacleById(
      obstacleId,
      description,
      solution,
    );

    if (updateObstacle.success) {
      console.log("Obstacle updated successfully");
      setObstacles((prev) =>
        prev.map((obs) =>
          obs.id === obstacleId
            ? {...obs, description, solution}
            : obs,
        ),
      );
      return true;
    } else {
      console.error("Error updating obstacle:", updateObstacle.error);
      return false;
    }
  };

  const handleObstacleDelete = async (obstacleId: string) => {
    console.log("Deleting obstacle with ID:", obstacleId);
    const deleteObstacle = await deleteHabitObstacle(obstacleId);

    if (deleteObstacle.success) {
      console.log("Obstacle deleted successfully");
      setObstacles((prev) =>
        prev.filter((obstacle) => obstacle.id !== obstacleId),
      );
      return true;
    } else {
      console.error("Error deleting obstacle:", deleteObstacle.error);
      return false;
    }
  };

  const handleAddNewObstacle = async (
    description: string,
    solution: string,
  ) => {
    try {
      console.log("New DATA:", habit?.id, description, solution);
      const newObstacle = await updateHabitObstacle(habit?.id, {
        description,
        solution,
      });
      if (newObstacle?.success) {
        console.log("New obstacle added successfully");
        setObstacles(newObstacle.updatedHabit.obstacles);
        return {success: true, newObstacle};
      } else {
        console.error("Error adding new obstacle:", newObstacle?.error);
        return {error: newObstacle?.error};
      }
    } catch (error) {
      console.error("Error adding new obstacle:", error);
      return {error: "Error adding new obstacle"};
    }
  };

  useEffect(() => {
    if (habit?.id) {
      getHabitPerformedDates(habit.id)
        .then((dates) => {
          setPerformedDates(dates.map((d: any) => new Date(d)));
        })
        .catch((error) => {
          console.error("Error fetching performed dates:", error);
        });
    }
  }, [habit]);

  function formatDate(date: Date) {
    if (!(date instanceof Date)) {
      return "";
    }

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  if (!habit) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <p>Select a habit to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-dark flex h-full flex-col overflow-y-auto p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <ListCollapse className="mr-2" />
          <h2 className="text-xl font-bold">{habit.title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {habit.startDate && (
            <Select defaultValue={formatDate(habit.startDate)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Start Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={formatDate(habit.startDate)}>
                  {formatDate(habit.startDate)}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsEdit(true)}>
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="HIGHEST STREAK"
              value={habit.streak}
              icon={Flame}
              color="text-orange-500"
            />
            <StatCard
              title="COMPLETED"
              value={habit.completed}
              subtext="---"
              icon={Check}
              color="text-green-500"
            />
            {/* <StatCard
              title="FAILED"
              value={habit.failed}
              subtext={
                <span className="flex items-center">
                  <ArrowUp size={12} className="mr-1" />
                  {habit.failed}
                </span>
              }
              icon={X}
              color="text-red-500"
            />
            <StatCard
              title="SKIPPED"
              value={habit.skipped}
              subtext="---"
              icon={ArrowRight}
              color="text-blue-500"
            />
            <StatCard title="TOTAL" value={habit.total} subtext="---" /> */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-600">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                modifiers={{ performed: performedDates }}
                modifiersStyles={{
                  performed: { backgroundColor: "rgba(34, 197, 94, 0.2)" },
                }}
              />
            </div>
            <div className="rounded-lg border border-gray-600 p-4">
              <ObstacleItem
                obstacle={obstacle}
                onDelete={(id: string) => handleObstacleDelete(id)}
                onSave={(
                  obstacleId: string,
                  description?: string,
                  solution?: string,
                ) => handleObstacleSave(obstacleId, description, solution)}
                onAdd={(description: string, solution: string) =>
                  handleAddNewObstacle(description, solution)
                }
              />
            </div>

            <div className="rounded-lg border border-gray-600 p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-400 ">
                DESCRIPTION
              </h3>
              <p className="mb-4 text-sm text-white">
                {habit.description || "Not Set"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-600 p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-400">
                SHARE YOUR PROGESS
              </h3>
              <p className="mb-4 text-xs text-white">
                Sharing habit progress with others can massively increase your
                chance of achieving your goals and sticking to this habit.
              </p>

              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <EditHabitModal habit={habit} onClose={() => setIsEdit(false)} />
      )}
    </div>
  );
}
