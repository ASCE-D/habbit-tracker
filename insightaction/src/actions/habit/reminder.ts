// app/actions/reminderActions.ts
'use server'
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
// import { sendNotification } from '../utils/notificationService';

//Implement the sendNotification function in app/utils/notificationService.ts. This function should integrate with your chosen notification service (e.g., Firebase Cloud Messaging, email service, or SMS gateway).

const prisma = new PrismaClient();

export async function setReminder(userId: string, habitId: string, time: Date, message?: string) {
  try {
    const reminder = await prisma.reminder.create({
      data: {
        userId,
        habitId,
        time,
        message,
        isActive: true,
      },
    });

    revalidatePath('/habits'); // Adjust the path as needed
    return { success: true, reminder };
  } catch (error) {
    console.error('Failed to set reminder:', error);
    return { success: false, error: 'Failed to set reminder' };
  }
}

export async function sendCurrentReminders() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    const dueReminders = await prisma.reminder.findMany({
      where: {
        isActive: true,
        time: {
          gte: fiveMinutesAgo,
          lte: now,
        },
      },
      include: {
        user: true,
        habit: true,
      },
    });

    for (const reminder of dueReminders) {
      // await sendNotification({
      //   userId: reminder.userId,
      //   title: `Reminder: ${reminder.habit.title}`,
      //   body: reminder.message || `Time to update your habit: ${reminder.habit.title}`,
      // });

      // Optionally, mark the reminder as inactive or delete it
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { isActive: false },
      });
    }

    return { success: true, sentCount: dueReminders.length };
  } catch (error) {
    console.error('Failed to send reminders:', error);
    return { success: false, error: 'Failed to send reminders' };
  }
}

export async function getRemindersByUser(userId: string) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId, isActive: true },
      include: { habit: true },
      orderBy: { time: 'asc' },
    });

    return { success: true, reminders };
  } catch (error) {
    console.error('Failed to get reminders:', error);
    return { success: false, error: 'Failed to get reminders' };
  }
}