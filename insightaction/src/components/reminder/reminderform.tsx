// app/reminders/ReminderForm.tsx

'use client';

import { setReminder } from '@/actions/habit/reminder';
import React, { useState } from 'react';


export default function ReminderForm({ userId, habitId }: { userId: string; habitId: string }) {
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await setReminder(userId, habitId, new Date(time), message);
    if (result.success) {
      alert('Reminder set successfully!');
      setTime('');
      setMessage('');
    } else {
      alert('Failed to set reminder. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Reminder Time
        </label>
        <input
          type="datetime-local"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message (optional)
        </label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Set Reminder
      </button>
    </form>
  );
}