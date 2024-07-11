// app/habit-tracker/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { getHabits } from "@/actions/habit"
import { trackHabit } from "@/actions/habit"

export default function HabitTracker() {
  const [habits, setHabits] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    setLoading(true)
    const result = await getHabits()
    if (result.error) {
      setError(result.error)
    } else {
      setHabits(result.habits)
    }
    setLoading(false)
  }

  const handleTrackHabit = async (habitId, completed, notes = '') => {
    const result = await trackHabit({
      habitId,
      date: new Date(selectedDate),
      completed,
      notes,
    })

    if (result.error) {
      console.error(result.error)
      // Handle error (e.g., show error message to user)
    } else {
      // Refresh habits to show updated tracking status
      fetchHabits()
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Habit Tracker</h1>

      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {habits.length === 0 ? (
        <p>You haven't created any habits yet.</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li key={habit.id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-medium">{habit.title}</h3>
              <p className="text-gray-600">{habit.description}</p>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(e) => handleTrackHabit(habit.id, e.target.checked)}
                  />
                  <span className="ml-2">Completed</span>
                </label>
              </div>
              <div className="mt-2">
                <label htmlFor={`notes-${habit.id}`} className="block text-sm font-medium text-gray-700">Notes:</label>
                <textarea
                  id={`notes-${habit.id}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={2}
                  onChange={(e) => handleTrackHabit(habit.id, true, e.target.value)}
                ></textarea>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}