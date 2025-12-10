'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-headline">새 회의록</h1>
        <p className="text-intro text-[var(--text-secondary)]">
          음성 파일이나 텍스트를 업로드하면
          <br />
          AI가 자동으로 요약해드립니다
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          dragActive
            ? 'border-[var(--link)] bg-[rgba(0,102,204,0.05)]'
            : 'border-[var(--border)]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".mp3,.wav,.m4a,.txt,.doc,.docx,.pdf"
          onChange={handleFileChange}
        />
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 text-[var(--text-tertiary)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-eyebrow text-[var(--text-primary)]">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-body text-[var(--text-tertiary)] mt-2">
              MP3, WAV, M4A, TXT, DOC, PDF (최대 100MB)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded File */}
      {uploadedFile && (
        <div className="p-5 border border-[#34c759] rounded-2xl bg-[rgba(52,199,89,0.05)]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#34c759] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-medium truncate">{uploadedFile.name}</p>
              <p className="text-caption text-[var(--text-tertiary)]">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--text-tertiary)]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Or divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-light)]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-[var(--background)] text-caption text-[var(--text-tertiary)]">
            또는
          </span>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-4">
        <label className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
          회의 내용 직접 입력
        </label>
        <textarea
          placeholder="회의 내용을 입력하세요..."
          className="w-full h-40 p-4 bg-[var(--background)] border border-[var(--border-light)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] resize-none"
        />
      </div>

      {/* Meeting Info */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
            회의 제목
          </label>
          <input
            type="text"
            placeholder="예: 2024 Q4 제품 로드맵 회의"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
          />
        </div>
        <div className="space-y-3">
          <label className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
            참석자
          </label>
          <input
            type="text"
            placeholder="예: 김영동, 이수진, 박민호"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button className="w-full py-4 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity">
        AI 요약 시작하기
      </button>

      <p className="text-center text-caption text-[var(--text-tertiary)]">
        업로드된 파일은 요약 후 안전하게 삭제됩니다
      </p>
    </div>
  );
}
