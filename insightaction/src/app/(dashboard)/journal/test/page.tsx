"use client";

import { useState } from "react";
import SimpleHabitList from "@/components/Dashboard/DragTest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function Page() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="App">
      <h1>Simple Draggable Habit List</h1>

      {/* DatePicker to select the date */}
      <DatePicker
        selected={date}
        //@ts-ignore
        onChange={(date: Date) => setDate(date)}
        inline
      />

      {/* Pass the selected date to SimpleHabitList */}
      <SimpleHabitList date={date} />
    </div>
  );
}
