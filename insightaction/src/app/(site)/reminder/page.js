// app/reminders/page.tsx

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import ReminderForm from './ReminderForm';
import CurrentReminders from './CurrentReminders';

const prisma = new PrismaClient();

export default async function SetRemindersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div>Please sign in to set reminders.</div>;
  }

  const userId = session.user.id;

  const habits = await prisma.habit.findMany({
    where: { userId },
    select: { id: true, title: true },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Reminders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Habits</h2>
          {habits.map((habit) => (
            <div key={habit.id} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-medium mb-2">{habit.title}</h3>
              <ReminderForm userId={userId} habitId={habit.id} />
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Current Reminders</h2>
          <CurrentReminders userId={userId} />
        </div>
      </div>
    </div>
  );
}