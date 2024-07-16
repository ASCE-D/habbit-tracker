"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

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

export function HabitDetails({ habit }: any) {
  const [date, setDate] = useState(new Date());
  return (
    <div className="bg-dark p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Twitter className="mr-2" />
          <h2 className="text-xl font-bold">Twitter</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="July, 2024">
            <option>July, 2024</option>
            {/* Add more months as needed */}
          </Select>
          <Button variant="ghost" size="icon">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="icon">
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
          value="0 days"
          icon={Flame}
          color="text-orange-500"
        />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="COMPLETED"
            value="0 days"
            subtext="---"
            icon={Check}
            color="text-green-500"
          />
          <StatCard
            title="FAILED"
            value="1 day"
            subtext={
              <span className="flex items-center">
                <ArrowUp size={12} className="mr-1" /> 1 day
              </span>
            }
            icon={X}
            color="text-red-500"
          />
          <StatCard
            title="SKIPPED"
            value="0 days"
            subtext="---"
            icon={ArrowRight}
            color="text-blue-500"
          />
          <StatCard title="TOTAL" value="0 times" subtext="---" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-800">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            />
          </div>
          <div className="rounded-lg border border-gray-800 p-4">
            <h3 className="mb-2 text-lg font-bold">Share your Progress</h3>
            <p className="mb-4 text-sm text-gray-400">
              Sharing habit progress with others can massively increase your
              chance of achieving your goals and sticking to this habit.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">https://share.habitify.m...</span>
              <Button variant="ghost" size="icon">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
