
import { getGoals,getHabits } from '@/actions/habit'

export default async function Dashboard() {
  const goalsResult = await getGoals()
  const habitsResult = await getHabits()

  if (goalsResult.error || habitsResult.error) {
    return <div>Error loading data</div>
  }

  const { goals } = goalsResult
  const { habits } = habitsResult

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
 
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
        {goals.length === 0 ? (
          <p>You havent set any goals yet.</p>
        ) : (
          <ul className="space-y-4">
        {goals.map((goal) => (
  <li key={goal.id} className="bg-white shadow rounded-lg p-4">
    <h3 className="text-xl font-medium">{goal.title}</h3>
    <p className="text-gray-600">{goal.description}</p>
    <div className="mt-2">
      <h4 className="font-medium">Habits:</h4>
      <ul className="list-disc list-inside">
        {goal.habits.map((habit) => (
          <li key={habit.id}>{habit.title}</li>
        ))}
      </ul>
      <a 
        href={`/myhabits/${goal.id}/add-habit`} 
        className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Habit
      </a>
    </div>
  </li>
))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Habits</h2>
        {habits.length === 0 ? (
          <p>You havent created any habits yet.</p>
        ) : (
          <ul className="space-y-4">
            {habits.map((habit) => (
              <li key={habit.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-medium">{habit.title}</h3>
                <p className="text-gray-600">{habit.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <strong>Cue:</strong> {habit.cue}
                  </div>
                  <div>
                    <strong>Craving:</strong> {habit.craving}
                  </div>
                  <div>
                    <strong>Response:</strong> {habit.response}
                  </div>
                  <div>
                    <strong>Reward:</strong> {habit.reward}
                  </div>
                </div>
                <div className="mt-2">
                  <strong>Implementation Intention:</strong> {habit.implementationIntention}
                </div>
                <div className="mt-2">
                  <strong>Environment:</strong> {habit.environment}
                </div>
                <div className="mt-2">
                  <strong>Time:</strong> {new Date(habit.time).toLocaleString()}
                </div>
                {habit.obstacles.length > 0 && (
                  <div className="mt-2">
                    <strong>Obstacles:</strong>
                    <ul className="list-disc list-inside">
                      {habit.obstacles.map((obstacle) => (
                        <li key={obstacle.id}>
                          {obstacle.description} - Solution: {obstacle.solution}
                        </li>
                      ))}
                    </ul>

                    <a 
        href={`/habit/${habit.id}`} 
        className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        view Habit
      </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}