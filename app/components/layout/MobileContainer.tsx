import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-[734px] mx-auto min-h-screen">
        <main className="pt-12 pb-24 px-6">{children}</main>
      </div>
    </div>
  );
}
