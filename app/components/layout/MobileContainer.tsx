import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-screen-md mx-auto bg-white dark:bg-gray-950 min-h-screen shadow-sm">
        <main className="pt-14 pb-20 px-4">{children}</main>
      </div>
    </div>
  );
}
