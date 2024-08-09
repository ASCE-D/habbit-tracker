'use client'

import { useState } from 'react';
import { saveToken, scheduleNotification } from '../../../actions/habit/notification';
import { getServerSession } from 'next-auth';


export default async function NotificationPreferences() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div>Please sign in to set reminders.</div>;
  }

  const userId = session.user.id;
  const [time, setTime] = useState('20:00');

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    await scheduleNotification(userId, time);
    alert('Notification preferences saved!');
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Here you would typically get the FCM token and save it
      // For this example, we'll use a dummy token
      const dummyToken = 'DUMMY_FCM_TOKEN';
      await saveToken(dummyToken, userId);
      alert('Notification permission granted and token saved!');
    } else {
      alert('Notification permission denied');
    }
  };

  return (
    <div>
      <h2>Notification Preferences</h2>
      <button onClick={requestNotificationPermission}>
        Enable Notifications
      </button>
      <form onSubmit={handleSavePreferences}>
        <label>
          Reminder Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
}
