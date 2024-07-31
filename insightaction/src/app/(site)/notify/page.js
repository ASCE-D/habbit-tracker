
'use client'
import React from 'react';
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';

export default function HabitPage() {
  return (
    <NovuProvider subscriberId={'on-boarding-subscriber-id-123'} applicationIdentifier={'VxPIlRqLOiIf'}>
      <PopoverNotificationCenter colorScheme={'light'}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};   