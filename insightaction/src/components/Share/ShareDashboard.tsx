"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subDays,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  isValid,
  getYear,
  getWeek,
} from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  PercentSquare,
  TrendingUp,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

const HabitTrackingDashboard = ({ habit }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("weekly");
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Use react-responsive directly

  const stats = useMemo(
    () => ({
      title: habit.title,
      frequency: habit.frequency || "Not set",
      startDate:
        habit.startDate && isValid(new Date(habit.startDate))
          ? format(new Date(habit.startDate), "PPP")
          : "Not set",
      streak: habit.streak,
      skipped: habit.skipped,
      failed: habit.failed,
      completed: habit.completed,
      total: habit.total,
    }),
    [habit],
  );

  const getChartData = () => {
    let data: any = [];
    let dateRange;

    if (viewMode === "daily") {
      dateRange = eachDayOfInterval({
        start: subDays(selectedDate, 6),
        end: selectedDate,
      });
      data = dateRange.map((date) => ({
        date: format(date, "MMM dd"),
        completed: habit.trackedDays?.find((day: any) => {
          const dayDate = day?.date ? new Date(day.date) : null;
          return (
            dayDate &&
            isValid(dayDate) &&
            isSameDay(dayDate, date) &&
            day.completed
          );
        })
          ? 1
          : 0,
      }));
    } else if (viewMode === "weekly") {
      dateRange = eachWeekOfInterval({
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
      });
      data = dateRange.map((week) => {
        const weekStart = startOfWeek(week);
        const weekEnd = endOfWeek(week);
        return {
          week: `Week ${getWeek(week)}`,
          completed:
            habit.trackedDays?.filter((day: any) => {
              const dayDate = day?.date ? new Date(day.date) : null;
              return (
                dayDate &&
                isValid(dayDate) &&
                dayDate >= weekStart &&
                dayDate <= weekEnd &&
                day.completed
              );
            }).length || 0,
        };
      });
    } else if (viewMode === "monthly") {
      const year = getYear(selectedDate);
      data = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(year, i);
        return {
          month: format(month, "MMM"),
          completed:
            habit.trackedDays?.filter((day: any) => {
              const dayDate = day?.date ? new Date(day.date) : null;
              return (
                dayDate &&
                isValid(dayDate) &&
                dayDate.getMonth() === i &&
                dayDate.getFullYear() === year &&
                day.completed
              );
            }).length || 0,
        };
      });
    }

    return data;
  };

  const chartData = useMemo(
    () => getChartData(),
    [habit, selectedDate, viewMode],
  );

  const icons: any = {
    "Habits Tracked": CalendarDays,
    "Days Completed": CheckCircle2,
    Streak: TrendingUp,
    "Completion Rate": PercentSquare,
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">
        Habit Tracking Dashboard
      </h1>

      {/* Stats Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {Object.entries(stats)
              .filter(([key]) => key !== "title")
              .map(([key, value]) => {
                const Icon = icons[key];
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center p-2 text-center"
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className="text-primary mb-1 md:size-24"
                      />
                    )}
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-base">
                      {key}
                    </h3>
                    <p className="mt-1 text-sm font-semibold md:text-xl">
                      {value}
                    </p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Chart and Calendar Section */}
      <div
        className={`${isMobile ? "flex flex-col space-y-4" : "grid grid-cols-3 gap-4"}`}
      >
        {/* Chart Card */}
        <Card className={`${isMobile ? "w-full" : "col-span-2"}`}>
          <CardHeader>
            <CardTitle className="text-xl">{stats.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily" onClick={() => setViewMode("daily")}>
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  onClick={() => setViewMode("weekly")}
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setViewMode("monthly")}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <div className="h-[250px] w-full md:h-[300px]">
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="weekly">
                <div className="h-[250px] w-full md:h-[300px]">
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="monthly">
                <div className="h-[250px] w-full md:h-[300px]">
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#ffc658"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className={`${isMobile ? "w-full" : "col-span-1"}`}>
          <CardHeader>
            <CardTitle className="text-xl">Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HabitTrackingDashboard;
