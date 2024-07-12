"use client"

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function HabitDetails({ habit }: {habit: any}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-4 p-2">
      <h2 className="text-2xl font-bold">{habit.name}</h2>

      <div className="grid grid-cols-2 gap-4">
        {["Streak", "Completed", "Skipped", "Failed"].map((stat) => (
          <Card key={stat}>
            <CardHeader>
              <CardTitle>{stat}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{habit[stat.toLowerCase()] || 0} days</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Share Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
            <div className="flex space-x-4 p-2">
              <Button variant="outline" className="p-2">
                <Twitter className="h-6 w-6 text-blue-500" />
              </Button>
              <Button variant="outline" className="p-2">
                <Facebook className="h-6 w-6 text-blue-700" />
              </Button>
              <Button variant="outline" className="p-2">
                <Instagram className="h-6 w-6 text-pink-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
