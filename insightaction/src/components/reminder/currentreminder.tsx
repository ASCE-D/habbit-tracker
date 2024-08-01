// app/reminders/CurrentReminders.tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CurrentReminders({ userId }: { userId: string }) {
  const reminders = await prisma.reminder.findMany({
    where: { userId, isActive: true },
    include: { habit: true },
    orderBy: { time: 'asc' },
  });

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="p-4 border rounded">
          <h3 className="text-lg font-medium">{reminder.habit.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(reminder.time).toLocaleString()}
          </p>
          {reminder.message && (
            <p className="mt-2 text-sm">{reminder.message}</p>
          )}
        </div>
      ))}
      {reminders.length === 0 && (
        <p className="text-gray-500">No active reminders.</p>
      )}
    </div>
  );
}