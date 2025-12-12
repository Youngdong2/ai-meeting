'use client';

import { useState, useEffect } from 'react';
import { TeamSetting, TeamSettingUpdateRequest } from '@/app/types/api';
import { teamApi } from '@/app/lib/api';

interface TeamSettingsProps {
  teamId: number;
}

export default function TeamSettings({ teamId }: TeamSettingsProps) {
  const [settings, setSettings] = useState<TeamSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [confluenceSiteUrl, setConfluenceSiteUrl] = useState('');
  const [confluenceApiToken, setConfluenceApiToken] = useState('');
  const [confluenceUserEmail, setConfluenceUserEmail] = useState('');
  const [confluenceSpaceKey, setConfluenceSpaceKey] = useState('');
  const [confluenceParentPageId, setConfluenceParentPageId] = useState('');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackBotToken, setSlackBotToken] = useState('');
  const [slackDefaultChannel, setSlackDefaultChannel] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const response = await teamApi.getSettings(teamId);

      if (response.success && response.data) {
        setSettings(response.data);
        setConfluenceSiteUrl(response.data.confluence_site_url || '');
        setConfluenceSpaceKey(response.data.confluence_space_key || '');
        setSlackDefaultChannel(response.data.slack_default_channel || '');
      } else {
        setError(response.error?.message || '설정을 불러오는데 실패했습니다.');
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, [teamId]);

  const handleSave = async (section: 'openai' | 'confluence' | 'slack') => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    let request: TeamSettingUpdateRequest = {};

    switch (section) {
      case 'openai':
        if (openaiApiKey) {
          request.openai_api_key = openaiApiKey;
        }
        break;
      case 'confluence':
        request = {
          confluence_site_url: confluenceSiteUrl || undefined,
          confluence_api_token: confluenceApiToken || undefined,
          confluence_user_email: confluenceUserEmail || undefined,
          confluence_space_key: confluenceSpaceKey || undefined,
          confluence_parent_page_id: confluenceParentPageId || undefined,
        };
        break;
      case 'slack':
        request = {
          slack_webhook_url: slackWebhookUrl || undefined,
          slack_bot_token: slackBotToken || undefined,
          slack_default_channel: slackDefaultChannel || undefined,
        };
        break;
    }

    const response = await teamApi.updateSettings(teamId, request);

    if (response.success && response.data) {
      setSettings(response.data);
      setSuccess('설정이 저장되었습니다.');
      // Clear sensitive fields
      setOpenaiApiKey('');
      setConfluenceApiToken('');
      setSlackWebhookUrl('');
      setSlackBotToken('');
    } else {
      setError(response.error?.message || '설정 저장에 실패했습니다.');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-secondary)]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-body">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-body">
          {success}
        </div>
      )}

      {/* OpenAI API Key */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
            OpenAI API
          </h2>
          {settings?.openai_api_key_set && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-caption rounded">
              설정됨
            </span>
          )}
        </div>
        <div className="space-y-4 p-5 border border-[var(--border-light)] rounded-2xl">
          <p className="text-caption text-[var(--text-secondary)]">
            회의록 요약 및 텍스트 교정에 사용되는 OpenAI API 키를 설정합니다.
          </p>
          <div>
            <label className="block text-caption text-[var(--text-secondary)] mb-2">API Key</label>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
              placeholder={settings?.openai_api_key_set ? '••••••••••••••••' : 'sk-...'}
            />
          </div>
          <button
            onClick={() => handleSave('openai')}
            disabled={isSaving || !openaiApiKey}
            className="px-6 py-3 bg-[var(--link)] text-white rounded-full text-body font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : 'API Key 저장'}
          </button>
        </div>
      </section>

      {/* Confluence Integration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
            Confluence 연동
          </h2>
          {settings?.confluence_configured && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-caption rounded">
              연동됨
            </span>
          )}
        </div>
        <div className="space-y-4 p-5 border border-[var(--border-light)] rounded-2xl">
          <p className="text-caption text-[var(--text-secondary)]">
            회의록을 Confluence 페이지로 자동 업로드합니다.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={confluenceSiteUrl}
                onChange={(e) => setConfluenceSiteUrl(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="https://company.atlassian.net"
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                User Email
              </label>
              <input
                type="email"
                value={confluenceUserEmail}
                onChange={(e) => setConfluenceUserEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="admin@company.com"
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                API Token
              </label>
              <input
                type="password"
                value={confluenceApiToken}
                onChange={(e) => setConfluenceApiToken(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="API 토큰 입력"
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                Space Key
              </label>
              <input
                type="text"
                value={confluenceSpaceKey}
                onChange={(e) => setConfluenceSpaceKey(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="MEETING"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                Parent Page ID (선택)
              </label>
              <input
                type="text"
                value={confluenceParentPageId}
                onChange={(e) => setConfluenceParentPageId(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="12345"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave('confluence')}
            disabled={isSaving}
            className="px-6 py-3 bg-[var(--link)] text-white rounded-full text-body font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : 'Confluence 설정 저장'}
          </button>
        </div>
      </section>

      {/* Slack Integration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
            Slack 연동
          </h2>
          {(settings?.slack_webhook_configured || settings?.slack_bot_configured) && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-caption rounded">
              연동됨
            </span>
          )}
        </div>
        <div className="space-y-4 p-5 border border-[var(--border-light)] rounded-2xl">
          <p className="text-caption text-[var(--text-secondary)]">
            회의록 요약을 Slack 채널에 공유합니다.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                Webhook URL
              </label>
              <input
                type="password"
                value={slackWebhookUrl}
                onChange={(e) => setSlackWebhookUrl(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder={
                  settings?.slack_webhook_configured
                    ? '••••••••••••••••'
                    : 'https://hooks.slack.com/services/...'
                }
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                Bot Token (선택)
              </label>
              <input
                type="password"
                value={slackBotToken}
                onChange={(e) => setSlackBotToken(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder={settings?.slack_bot_configured ? '••••••••••••••••' : 'xoxb-...'}
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                기본 채널
              </label>
              <input
                type="text"
                value={slackDefaultChannel}
                onChange={(e) => setSlackDefaultChannel(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="#meeting-notes"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave('slack')}
            disabled={isSaving}
            className="px-6 py-3 bg-[var(--link)] text-white rounded-full text-body font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : 'Slack 설정 저장'}
          </button>
        </div>
      </section>
    </div>
  );
}
