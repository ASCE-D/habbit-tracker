// pages/set-goals-habits.js
'use client'
import { useState } from 'react';
import { PrismaClient } from '@prisma/client';

export default function SetGoalsHabits() {
  const [goal, setGoal] = useState('');
  const [habits, setHabits] = useState([{ title: '', cue: '', craving: '', response: '', reward: '' }]);

  const addHabit = () => {
    setHabits([...habits, { title: '', cue: '', craving: '', response: '', reward: '' }]);
  };

  const handleHabitChange = (index, field, value) => {
    const updatedHabits = habits.map((habit, i) => 
      i === index ? { ...habit, [field]: value } : habit
    );
    setHabits(updatedHabits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send this data to your API
    console.log({ goal, habits });
    // Reset form after submission
    setGoal('');
    setHabits([{ title: '', cue: '', craving: '', response: '', reward: '' }]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Set Your Goal and Habits</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Goal</label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Habits</h2>
          {habits.map((habit, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Habit Title"
                value={habit.title}
                onChange={(e) => handleHabitChange(index, 'title', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
              <input
                type="text"
                placeholder="Cue"
                value={habit.cue}
                onChange={(e) => handleHabitChange(index, 'cue', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
              <input
                type="text"
                placeholder="Craving"
                value={habit.craving}
                onChange={(e) => handleHabitChange(index, 'craving', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
              <input
                type="text"
                placeholder="Response"
                value={habit.response}
                onChange={(e) => handleHabitChange(index, 'response', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
              <input
                type="text"
                placeholder="Reward"
                value={habit.reward}
                onChange={(e) => handleHabitChange(index, 'reward', e.target.value)}
                className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addHabit}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Another Habit
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Goal and Habits
        </button>
      </form>
    </div>
  );
}

// export async function getServerSideProps() {
//   const prisma = new PrismaClient();
//   // You can fetch any necessary data here
//   // For example, existing goals or habits
//   return { props: {} };
// }