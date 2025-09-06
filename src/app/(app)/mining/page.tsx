'use client';

import { FocusTimer } from '@/components/focus/FocusTimer';
import { FocusStatus } from '@/components/focus/FocusStatus';
import { useGofr } from '@/hooks/use-gofr';
import { useEffect } from 'react';

export default function FocusPage() {
  const { user, focusData, fetchFocusData } = useGofr();

  useEffect(() => {
    if (user) {
      fetchFocusData(user.id);
    }
  }, [user, fetchFocusData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
      <div className="lg:col-span-2">
        <FocusTimer />
      </div>
      <div className="lg:col-span-1">
        <FocusStatus 
          userId={user?.id || ''} 
          focusData={focusData || {
            userId: user?.id || '',
            status: 'idle',
            totalSessions: 0,
            completedSessions: 0,
            totalStaked: 0,
            totalEarned: 0,
            streak: 0,
            lastUpdated: new Date().toISOString()
          }} 
        />
      </div>
    </div>
  );
}
