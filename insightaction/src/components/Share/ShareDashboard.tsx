"use client";
import React, { useState, useMemo } from "react";
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
import { Habit } from "@prisma/client";
import { CalendarDays, CheckCircle2, PercentSquare, TrendingUp } from "lucide-react";

const HabitTrackingDashboard = ({ habit }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");

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
  console.log(habit);

  const icons: any = {
    "Habits Tracked": CalendarDays,
    "Days Completed": CheckCircle2,
    Streak: TrendingUp,
    "Completion Rate": PercentSquare,
  };

  return (
    <div className="container mx-auto px-4">
      <div>
        <h1 className="mb-6 text-3xl font-bold">Habit Tracking Dashboard</h1>
        <div>
          {" "}
          <Card className="flex flex-col">
            {/* <CardHeader>
              <CardTitle className="text-xl">{stats.title}</CardTitle>
            </CardHeader> */}
            <CardContent className="flex flex-grow items-center justify-center">
              <div className="grid w-full grid-cols-7  ">
                {Object.entries(stats)
                  .filter(([key]) => key !== "title")
                  .map(([key, value]) => {
                    const Icon = icons[key];
                    return (
                      <div
                        key={key}
                        className="my-8 flex flex-col items-center text-center"
                      >
                        {Icon && (
                          <Icon size={24} className="text-primary mb-1" />
                        )}
                        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                          {key}
                        </h3>
                        <p className="mt-1 text-xl font-semibold">{value}</p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <Card className="my-6 flex w-full">
            <div className="w-full">
              <div className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>{stats.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="daily" className="w-full">
                      <TabsList>
                        <TabsTrigger
                          value="daily"
                          onClick={() => setViewMode("daily")}
                        >
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
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="completed"
                              stroke="#8884d8"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>
                      <TabsContent value="weekly">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="completed"
                              stroke="#82ca9d"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>
                      <TabsContent value="monthly">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="completed"
                              stroke="#ffc658"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <Card className="my-4 mx-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitTrackingDashboard;
