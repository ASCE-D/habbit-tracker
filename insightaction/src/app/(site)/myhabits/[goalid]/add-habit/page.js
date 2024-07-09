'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createHabit } from '@/actions/habit'
import { Input } from "@/components/ui/input"

export default function AddHabitPage({ params }) {
  const router = useRouter()
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

  useEffect(() => {
    if (params.goalId) {
      setCurrentGoalId(params.goalId)
    }
  }, [params.goalId])

  const handleHabitChange = (e) => {
    const { name, value } = e.target
    setHabitData(prev => ({ ...prev, [name]: value }))
  }

  const handleHabitSubmit = async (e) => {
    e.preventDefault()
  

    const result = await createHabit({
      ...habitData,
      goalId: params.goalId,
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

  return (
    <>
       (
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
                <Input
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
      
    </>
  )
}