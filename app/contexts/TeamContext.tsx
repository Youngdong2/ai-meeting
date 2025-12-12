'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Team } from '@/app/types/api';
import { teamApi, tokenManager } from '@/app/lib/api';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  setCurrentTeam: (team: Team) => void;
  refreshTeams: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const CURRENT_TEAM_KEY = 'current_team_id';

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTeams = useCallback(async () => {
    if (!tokenManager.isAuthenticated()) {
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
  }, []);

  useEffect(() => {
    let mounted = true;

    const initTeams = async () => {
      if (!tokenManager.isAuthenticated()) {
        if (mounted) {
          setTeams([]);
          setCurrentTeamState(null);
          setIsLoading(false);
        }
        return;
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

    initTeams();

    return () => {
      mounted = false;
    };
  }, []);

  const setCurrentTeam = useCallback((team: Team) => {
    setCurrentTeamState(team);
    localStorage.setItem(CURRENT_TEAM_KEY, team.id.toString());
  }, []);

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        isLoading,
        error,
        setCurrentTeam,
        refreshTeams,
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
