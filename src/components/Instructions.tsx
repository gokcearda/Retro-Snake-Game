import React from 'react';
import { Keyboard } from 'lucide-react';

export const Instructions: React.FC = () => {
  return (
    <div className="text-white/90 space-y-4">
      <div className="flex items-center gap-2 text-white mb-2">
        <Keyboard className="w-5 h-5" />
        <span className="font-medium">Controls</span>
      </div>
      
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑</kbd>
          <span>Move Up</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↓</kbd>
          <span>Move Down</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
          <span>Move Left</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
          <span>Move Right</span>
        </li>
        <li className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
          <span>Pause Game</span>
        </li>
      </ul>

      <div className="pt-4 space-y-2 text-sm">
        <p>🎯 Collect the red food to grow longer</p>
        <p>⚠️ Avoid hitting yourself</p>
        <p>🏆 Try to achieve the highest score!</p>
      </div>
    </div>
  );
};