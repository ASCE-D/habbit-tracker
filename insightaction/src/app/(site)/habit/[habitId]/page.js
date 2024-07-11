'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getHabit, getHabitStreak } from '@/actions/habit'

export default function HabitPage() {
  const params = useParams()
  const [habit, setHabit] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHabitData() {
      if (params.habitId) {
        try {
          const habitData = await getHabit(params.habitId)
          setHabit(habitData)
          const streakData = await getHabitStreak(params.habitId)
          setStreak(streakData)
        } catch (error) {
          console.error('Error fetching habit data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchHabitData()
  }, [params.habitId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!habit) {
    return <div>Habit not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{habit.title}</h1>
      <p className="text-xl mb-2">Current Streak: {streak} days</p>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-2">Habit Details</h2>
        <p><strong>Description:</strong> {habit.description}</p>
        <p><strong>Cue:</strong> {habit.cue}</p>
        <p><strong>Craving:</strong> {habit.craving}</p>
        <p><strong>Response:</strong> {habit.response}</p>
        <p><strong>Reward:</strong> {habit.reward}</p>
        <p><strong>Implementation Intention:</strong> {habit.implementationIntention}</p>
        <p><strong>Environment:</strong> {habit.environment}</p>
        <p><strong>Time:</strong> {new Date(habit.time).toLocaleString()}</p>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-2">Obstacle Plan</h2>
        {habit.obstacles && habit.obstacles.map((obstacle, index) => (
          <div key={index} className="mb-4">
            <p><strong>Obstacle:</strong> {obstacle.description}</p>
            <p><strong>Solution:</strong> {obstacle.solution}</p>
          </div>
        ))}
      </div>
    </div>
  )
}