'use client'

import { useState, useEffect } from 'react'
import { fetchHabits, stackHabit } from '@/actions/habit'

export default function HabitStackingPage() {
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState('')
  const [stackedHabit, setStackedHabit] = useState('')
  const [implementationIntention, setImplementationIntention] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHabits()
  }, [])

  async function loadHabits() {
    try {
      const fetchedHabits = await fetchHabits()
      if (Array.isArray(fetchedHabits)) {
        setHabits(fetchedHabits)
      } else {
        throw new Error('Fetched habits is not an array')
      }
    } catch (error) {
      console.error('Error loading habits:', error)
      setError('Failed to load habits. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStackHabit(e) {
    e.preventDefault()
    try {
      await stackHabit(selectedHabit, stackedHabit, implementationIntention)
      alert('Habit stacked successfully!')
      setSelectedHabit('')
      setStackedHabit('')
      setImplementationIntention('')
      loadHabits() // Refresh the habits list
    } catch (error) {
      console.error('Error stacking habit:', error)
      alert('Failed to stack habit. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Habit Stacking</h1>
      <form onSubmit={handleStackHabit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">Select a habit to stack:</label>
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a habit</option>
            {Array.isArray(habits) && habits.map((habit) => (
              <option key={habit.id} value={habit.id}>{habit.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Stack on top of:</label>
          <select
            value={stackedHabit}
            onChange={(e) => setStackedHabit(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a habit</option>
            {Array.isArray(habits) && habits.filter(h => h.id !== selectedHabit).map((habit) => (
              <option key={habit.id} value={habit.id}>{habit.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Implementation Intention:</label>
          <input
            type="text"
            value={implementationIntention}
            onChange={(e) => setImplementationIntention(e.target.value)}
            placeholder="I will [Action] at [Time] in [Location]"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Stack Habit</button>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Stacked Habits</h2>
        {Array.isArray(habits) && habits.filter(h => h.stackedHabitId).map((habit) => (
          <div key={habit.id} className="mb-4 p-4 border rounded">
            <p><strong>{habit.title}</strong> is stacked on top of <strong>{habits.find(h => h.id === habit.stackedHabitId)?.title}</strong></p>
            <p>Implementation Intention: {habit.implementationIntention}</p>
          </div>
        ))}
      </div>
    </div>
  )
}