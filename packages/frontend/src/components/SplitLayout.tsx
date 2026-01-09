import { ReactNode } from 'react';
import { ChatInterface } from './ChatInterface';
import { RightPanel } from './RightPanel';

interface SplitLayoutProps {
  children?: ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Left Panel: Chat */}
      <div className="flex-1 min-w-0 flex-shrink-0 h-full">
        {children || <ChatInterface />}
      </div>

      {/* Right Panel: Tabs */}
      <div className="w-[50%] min-w-[400px] max-w-[60%] flex-shrink-0 h-full">
        <RightPanel />
      </div>
    </div>
  );
}

