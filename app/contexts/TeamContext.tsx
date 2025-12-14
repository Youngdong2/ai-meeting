'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Team, CreateTeamRequest } from '@/app/types/api';
import { teamApi } from '@/app/lib/api';
import { useAuth } from './AuthContext';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  setCurrentTeam: (team: Team) => void;
  refreshTeams: () => Promise<void>;
  createTeam: (request: CreateTeamRequest) => Promise<{ success: boolean; error?: string }>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const CURRENT_TEAM_KEY = 'current_team_id';

export function TeamProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTeams = useCallback(async () => {
    if (!isAuthenticated) {
      setTeams([]);
      setCurrentTeamState(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await teamApi.list();

    if (response.success && response.data) {
      setTeams(response.data);

      // 저장된 팀 ID가 있으면 복원
      const savedTeamId = localStorage.getItem(CURRENT_TEAM_KEY);
      if (savedTeamId) {
        const savedTeam = response.data.find((t) => t.id === parseInt(savedTeamId, 10));
        if (savedTeam) {
          setCurrentTeamState(savedTeam);
        } else if (response.data.length > 0) {
          setCurrentTeamState(response.data[0]);
        }
      } else if (response.data.length > 0) {
        setCurrentTeamState(response.data[0]);
      }
    } else {
      setError(response.error?.message || '팀 목록을 불러오는데 실패했습니다');
    }

    setIsLoading(false);
  }, [isAuthenticated]);

  // isAuthenticated 상태 변화 감지하여 팀 목록 가져오기
  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    let mounted = true;

    const handleAuthChange = async () => {
      // 로그아웃된 경우 초기화
      if (!isAuthenticated) {
        if (mounted) {
          setTeams([]);
          setCurrentTeamState(null);
          setIsLoading(false);
        }
        return;
      }

      // 로그인된 경우 팀 목록 가져오기
      if (mounted) {
        setIsLoading(true);
      }
      const response = await teamApi.list();

      if (mounted) {
        if (response.success && response.data) {
          setTeams(response.data);

          const savedTeamId = localStorage.getItem(CURRENT_TEAM_KEY);
          if (savedTeamId) {
            const savedTeam = response.data.find((t) => t.id === parseInt(savedTeamId, 10));
            if (savedTeam) {
              setCurrentTeamState(savedTeam);
            } else if (response.data.length > 0) {
              setCurrentTeamState(response.data[0]);
            }
          } else if (response.data.length > 0) {
            setCurrentTeamState(response.data[0]);
          }
        } else {
          setError(response.error?.message || '팀 목록을 불러오는데 실패했습니다');
        }
        setIsLoading(false);
      }
    };

    handleAuthChange();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authLoading]);

  const setCurrentTeam = useCallback((team: Team) => {
    setCurrentTeamState(team);
    localStorage.setItem(CURRENT_TEAM_KEY, team.id.toString());
  }, []);

  const createTeam = useCallback(
    async (request: CreateTeamRequest): Promise<{ success: boolean; error?: string }> => {
      const response = await teamApi.create(request);

      if (response.success && response.data && response.data.id) {
        // 팀 목록에 새 팀 추가
        setTeams((prev) => [...prev, response.data!]);
        // 새로 생성한 팀을 현재 팀으로 설정
        setCurrentTeamState(response.data);
        localStorage.setItem(CURRENT_TEAM_KEY, response.data.id.toString());
        return { success: true };
      }

      // 팀은 생성되었지만 응답 데이터가 불완전한 경우 팀 목록 새로고침
      if (response.success) {
        await refreshTeams();
        return { success: true };
      }

      return { success: false, error: response.error?.message || '팀 생성에 실패했습니다' };
    },
    [refreshTeams]
  );

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        isLoading,
        error,
        setCurrentTeam,
        refreshTeams,
        createTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
