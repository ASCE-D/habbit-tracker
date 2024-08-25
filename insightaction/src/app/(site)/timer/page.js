'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pause, Play } from 'lucide-react'

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check for notification permission when component mounts
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      setIsPaused(false);
      clearInterval(interval);
      if (notificationPermission === 'granted') {
        new Notification('Timer Finished!', {
          body: 'Your timer has completed.',
          icon: '/path-to-your-icon.png' // Optional: Add an icon for your notification
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, time, notificationPermission]);

  const handleStart = () => {
    if (inputTime && !isNaN(inputTime)) {
      setTime(parseInt(inputTime, 10) * 60);
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTime(0);
    setIsActive(false);
    setIsPaused(false);
    setInputTime('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-half max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-8xl font-bold text-center">
              {formatTime(time)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timer-input">Set timer (minutes)</Label>
              <Input
                id="timer-input"
                type="number"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                placeholder="Enter minutes"
                className="w-full"
              />
            </div>
            {notificationPermission !== 'granted' && (
              <Button onClick={requestNotificationPermission}>
                Enable Notifications
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          {!isActive ? (
            <Button onClick={handleStart}>Start</Button>
          ) : (
            <Button onClick={handlePauseResume}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Timer;