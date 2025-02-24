import React from 'react';
import { Medal } from 'lucide-react';

interface LeaderboardProps {
  scores: Array<{ name: string; score: number }>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <div className="space-y-2">
      {scores.map((score, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {index < 3 && (
            <Medal className={`w-5 h-5 ${
              index === 0 ? 'text-yellow-400' :
              index === 1 ? 'text-gray-400' :
              'text-amber-600'
            }`} />
          )}
          <span className={`text-white/90 ${index < 3 ? 'font-medium' : ''}`}>
            {score.name}
          </span>
          <span className="ml-auto text-white/75">{score.score}</span>
        </div>
      ))}
      
      {scores.length === 0 && (
        <p className="text-white/50 text-center text-sm">
          No scores yet. Be the first!
        </p>
      )}
    </div>
  );
};