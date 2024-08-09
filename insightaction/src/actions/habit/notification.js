'use server'

import { sendNotification } from '../../lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export async function saveToken(token, userId) {
  // TODO: Implement saving token to your database
  console.log(`Saving token ${token} for user ${userId}`);
  // After saving, revalidate the notifications page
  revalidatePath('/notifications');
}

export async function scheduleNotification(userId, time) {
  // TODO: Implement scheduling logic in your database
  console.log(`Scheduling notification for user ${userId} at ${time}`);
  // After scheduling, revalidate the notifications page
  revalidatePath('/notifications');
}

export async function sendReminderNotification(userId) {
  // TODO: Fetch user's FCM token from your database
  const userToken = 'FETCH_USER_TOKEN_HERE';
  const result = await sendNotification(
    userToken,
    'Habit Tracker Reminder',
    'Don\'t forget to update your habits today!'
  );
  return result;
}
