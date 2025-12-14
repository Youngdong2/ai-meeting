'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTeam } from '@/app/contexts/TeamContext';
import ProfileSettings from './ProfileSettings';
import TeamSettings from './TeamSettings';
import TeamMembers from './TeamMembers';

type SettingsTab = 'profile' | 'team' | 'members';

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentTeam, isLoading: teamLoading } = useTeam();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  if (authLoading || teamLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const isTeamAdmin = user.is_team_admin;

  const tabs: { id: SettingsTab; label: string; adminOnly?: boolean }[] = [
    { id: 'profile', label: '프로필' },
    { id: 'team', label: '팀 설정', adminOnly: true },
    { id: 'members', label: '멤버 관리', adminOnly: true },
  ];

  const visibleTabs = tabs.filter((tab) => !tab.adminOnly || isTeamAdmin);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-headline">설정</h1>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--border-light)]">
        <nav className="flex gap-6">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-body transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[var(--link)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--link)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'profile' && <ProfileSettings user={user} />}
        {activeTab === 'team' && isTeamAdmin && currentTeam && (
          <TeamSettings teamId={currentTeam.id} />
        )}
        {activeTab === 'members' && isTeamAdmin && currentTeam && (
          <TeamMembers teamId={currentTeam.id} />
        )}
      </div>
    </div>
  );
}
