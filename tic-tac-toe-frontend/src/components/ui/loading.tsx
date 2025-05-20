import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center min-h-[40px]", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default Loading; 