'use client';

interface AudioLevelMeterProps {
  level: number; // 0-100
  isActive: boolean;
}

export default function AudioLevelMeter({ level, isActive }: AudioLevelMeterProps) {
  // 막대 개수
  const barCount = 20;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  // 활성화된 막대 개수 계산
  const activeBarCount = Math.round((level / 100) * barCount);

  // 색상 결정 (레벨에 따라)
  const getBarColor = (index: number) => {
    if (!isActive || index >= activeBarCount) {
      return 'bg-[var(--border-light)]';
    }

    const percentage = (index / barCount) * 100;
    if (percentage < 60) {
      return 'bg-[#34c759]'; // 녹색
    } else if (percentage < 80) {
      return 'bg-[#ffcc00]'; // 노란색
    } else {
      return 'bg-[#ff3b30]'; // 빨간색
    }
  };

  return (
    <div className="flex items-end justify-center gap-1 h-16">
      {bars.map((index) => {
        // 각 막대의 높이 (점점 커지는 패턴)
        const baseHeight = 20 + (index / barCount) * 80;
        const height = isActive && index < activeBarCount ? baseHeight : 20;

        return (
          <div
            key={index}
            className={`w-2 rounded-full transition-all duration-75 ${getBarColor(index)}`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}
