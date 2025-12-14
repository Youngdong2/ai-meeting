'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Meeting, MeetingListItem } from '@/app/types/api';
import { meetingApi, tokenManager } from '@/app/lib/api';

interface MeetingContextType {
  meetings: MeetingListItem[];
  currentMeeting: Meeting | null;
  isLoading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  fetchMeeting: (id: number) => Promise<Meeting | null>;
  clearCurrentMeeting: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    if (!tokenManager.isAuthenticated()) {
      setMeetings([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await meetingApi.list();

    if (response.success && response.data) {
      // 백엔드가 이미 사용자의 팀에 속한 회의록만 반환함
      setMeetings(response.data);
    } else {
      setError(response.error?.message || '회의록 목록을 불러오는데 실패했습니다');
    }

    setIsLoading(false);
  }, []);

  const fetchMeeting = useCallback(async (id: number): Promise<Meeting | null> => {
    if (!tokenManager.isAuthenticated()) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    const response = await meetingApi.get(id);

    if (response.success && response.data) {
      setCurrentMeeting(response.data);
      setIsLoading(false);
      return response.data;
    } else {
      setError(response.error?.message || '회의록을 불러오는데 실패했습니다');
      setIsLoading(false);
      return null;
    }
  }, []);

  const clearCurrentMeeting = useCallback(() => {
    setCurrentMeeting(null);
  }, []);

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        currentMeeting,
        isLoading,
        error,
        fetchMeetings,
        fetchMeeting,
        clearCurrentMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
}
