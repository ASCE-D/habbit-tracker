// app/goals-and-habits/page.tsx

'use client'

import { useState } from 'react'
// import { createGoal } from '@/app/actions/createGoal'
// import { createHabit } from '@/app/actions/createHabit'
import { createGoal, createHabit } from '@/actions/habit'

export default function GoalsAndHabitsPage() {
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')
  const [currentGoalId, setCurrentGoalId] = useState('')
  const [habitData, setHabitData] = useState({
    title: '',
    description: '',
    cue: '',
    craving: '',
    response: '',
    reward: '',
    implementationIntention: '',
    environment: '',
    time: '',
    obstacleDescription: '',
    obstacleSolution: ''
  })

  const handleGoalSubmit = async (e) => {
    e.preventDefault()
    const result = await createGoal({
      title: goalTitle,
      description: goalDescription,
      currentPath: '/createhabit',
    })

    if (result.error) {
      console.error(result.error)
      // Handle error (e.g., show error message to user)
    } else {
      console.log('Goal created:', result.goal)
      setCurrentGoalId(result.goal.id)
      // Reset form or show success message
      setGoalTitle('')
      setGoalDescription('')
    }
  }

  const handleHabitSubmit = async (e) => {
    e.preventDefault()
    if (!currentGoalId) {
      console.error('No goal selected')
      return
    }

    const result = await createHabit({
      ...habitData,
      goalId: currentGoalId,
      time: new Date(habitData.time),
      obstacles: [
        {
          description: habitData.obstacleDescription,
          solution: habitData.obstacleSolution,
        },
      ],
      currentPath: '/createhabit',
    })

    if (result.error) {
      console.error(result.error)
      // Handle error (e.g., show error message to user)
    } else {
      console.log('Habit created:', result.habit)
      // Reset form or show success message
      setHabitData({
        title: '',
        description: '',
        cue: '',
        craving: '',
        response: '',
        reward: '',
        implementationIntention: '',
        environment: '',
        time: '',
        obstacleDescription: '',
        obstacleSolution: '',
      })
    }
  }

  const handleHabitChange = (e) => {
    const { name, value } = e.target
    setHabitData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto my-8 px-6 py-16">
      <h1 className="text-3xl font-bold my-6">Set Your Goals and Habits</h1>

      {/* Goal Form */}
      <form onSubmit={handleGoalSubmit} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create a New Goal</h2>
        <div className="mb-4">
          <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 dark:text-white">Goal Title</label>
          <input
            type="text"
            id="goalTitle"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-white">Goal Description</label>
          <textarea
            id="goalDescription"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            className="p-2 mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create Goal
        </button>
      </form>

      {/* Habit Form */}
      {currentGoalId && (
        <form onSubmit={handleHabitSubmit}>
          <h2 className="text-2xl font-semibold mb-4">Create a New Habit for Your Goal</h2>
          {Object.entries(habitData).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {key === 'description' ? (
                <textarea
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleHabitChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <input
                  type={key === 'time' ? 'datetime-local' : 'text'}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleHabitChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required={key !== 'description'}
                />
              )}
            </div>
          ))}
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Create Habit
          </button>
        </form>
      )}
    </div>
  )
}