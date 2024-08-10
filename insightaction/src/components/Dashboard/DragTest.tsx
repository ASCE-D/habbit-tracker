"use client"

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false },
);
const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false },
);
const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false },
);

const NextjsDndHabitList = () => {
  const [habits, setHabits] = useState([
    { id: "habit1", content: "Exercise" },
    { id: "habit2", content: "Read a book" },
    { id: "habit3", content: "Meditate" },
    { id: "habit4", content: "Drink water" },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("Habits state:", habits);
  }, [habits]);

  const onDragEnd = (result: any) => {
    console.log("Drag ended:", result);
    if (!result.destination) return;

    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHabits(items);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h2>Habit List</h2>
      <Droppable droppableId="list">
        {(provided, snapshot) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {habits.map((habit, index) => (
              <Draggable key={habit.id} draggableId={habit.id} index={index}>
                {(provided, snapshot) => {
                  console.log(`Rendering Draggable for habit: ${habit.id}`);
                  return (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        backgroundColor: snapshot.isDragging
                          ? "#f0f0f0"
                          : "gray",
                      }}
                    >
                      {habit.content} (ID: {habit.id}, Index: {index})
                    </li>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default NextjsDndHabitList;