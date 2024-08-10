"use client";

import React, { useEffect, useState } from "react";
import {
  Flame,
  Check,
  X,
  ArrowRight,
  ArrowUp,
  Twitter,
  Share2,
  CalendarIcon,
  Edit,
  MoreHorizontal,
  ListCollapse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { getHabitPerformedDates } from "@/actions/habit";
import { redirect, useRouter } from "next/navigation";

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

export default function HabitDetails({ habit }: any) {
  const [date, setDate] = useState(new Date());
  const [performedDates, setPerformedDates] = useState<Date[]>([]);

  const router = useRouter();

  const handleShare = () => {
    if (habit?.id) {
      router.push(`/share/${habit.id}`);
    }
  };

  useEffect(() => {
    if (habit?.id) {
      getHabitPerformedDates(habit.id)
        .then((dates) => {
          //@ts-ignore
          setPerformedDates(dates.map((d: string) => new Date(d)));
        })
        .catch((error) => {
          console.error("Error fetching performed dates:", error);
        });
    }
  }, [habit]);

  // console.log(habit);

  return (
    <div className="bg-dark p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <ListCollapse className="mr-2" />
          <h2 className="text-xl font-bold">
            {habit ? habit.title : "Select Habit to view details... "}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="July, 2024">
            <option>July, 2024</option>
            {/* Add more months as needed */}
          </Select>
          <Button variant="ghost" size="icon">
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

      <div className="space-y-4">
        <StatCard
          title="CURRENT STREAK"
          value={habit ? habit.streak : "0 days"}
          icon={Flame}
          color="text-orange-500"
        />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="COMPLETED"
            value={habit ? habit.completed : "0 days"}
            subtext="---"
            icon={Check}
            color="text-green-500"
          />
          <StatCard
            title="FAILED"
            value={habit ? habit.failed : "0 days"}
            subtext={
              <span className="flex items-center">
                <ArrowUp size={12} className="mr-1" />{" "}
                {habit ? habit.failed : "0 days"}
              </span>
            }
            icon={X}
            color="text-red-500"
          />
          <StatCard
            title="SKIPPED"
            value={habit ? habit.skipped : "0 days"}
            subtext="---"
            icon={ArrowRight}
            color="text-blue-500"
          />
          <StatCard
            title="TOTAL"
            value={habit ? habit.total : "0 days"}
            subtext="---"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-600">
            {/* <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            /> */}

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
            <h3 className="mb-2 text-lg font-bold">Share your Progress</h3>
            <p className="mb-4 text-sm text-gray-400">
              Sharing habit progress with others can massively increase your
              chance of achieving your goals and sticking to this habit.
            </p>
            <div className="flex items-center space-x-2">
              {
                // <span className="text-blue-400">https://share.habitify.m...</span>
                <Button variant="ghost" size="icon">
                  <Share2 size={18} />
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
