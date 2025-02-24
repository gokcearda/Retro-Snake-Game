import React, { useEffect, useRef, useState } from 'react';
import { ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from './firebase';
import { GameBoard } from './components/GameBoard';
import { Instructions } from './components/Instructions';
import { Leaderboard } from './components/Leaderboard';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gamepad2, Trophy, Pause, Play } from 'lucide-react';

const GRID_SIZE = 25;
const CELL_SIZE = 20;
const GAME_SPEED = 100;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

function App() {
  const [snake, setSnake] = useState<Position[]>([{ x: 12, y: 12 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<Array<{ name: string; score: number }>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const directionRef = useRef<Direction | null>(direction);
  const foodRef = useRef<Position>(food);
  const gameOverFlag = useRef(false);
  const scoreRef = useRef(score);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const scoresRef = query(ref(db, 'leaderboard'), orderByChild('score'), limitToLast(10));
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const scores: Array<{ name: string; score: number }> = [];
      snapshot.forEach((childSnapshot) => {
        scores.push(childSnapshot.val());
      });
      setHighScores(scores.sort((a, b) => b.score - a.score));
    });

    return () => {
      unsubscribe();
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused, gameOver]);

  useEffect(() => {
    if (!isPaused && isPlaying && !gameOver && !gameLoopRef.current) {
      moveSnake();
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
  }, [isPaused, isPlaying, gameOver]);

  const generateFood = (): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isPaused && e.key !== ' ') return;
    
    if (isPlaying && !gameLoopRef.current && !gameOver) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (e.key === 'ArrowUp') setDirection('UP');
        else if (e.key === 'ArrowDown') setDirection('DOWN');
        else if (e.key === 'ArrowLeft') setDirection('LEFT');
        else if (e.key === 'ArrowRight') setDirection('RIGHT');
        gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
        return;
      }
    }

    const currentDirection = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
        if (currentDirection !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (currentDirection !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (currentDirection !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (currentDirection !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        togglePause();
        break;
    }
  };

  const moveSnake = () => {
    if (gameOver || !isPlaying || isPaused) return;
    if (!directionRef.current) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (directionRef.current) {
        case 'UP':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % GRID_SIZE;
          break;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      newSnake.unshift(head);

      const currentFood = foodRef.current;
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore(prevScore => prevScore + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  // Küfür filtreleme fonksiyonu
  const filterBadWords = (input: string): string => {
    let filteredName = input;
    const badWords = [
      "am", "göt", "meme", "31", "otuzbir", "sik", "amcık", "mcık", "yarak", "pipi",
      "69", "altmışdoku", "otuz bir", "bacı", "yar", "rock",  "4m", "y4r4k", "yɐrɐk", "53r3f", "s3rf", "sh3rf"
    ];
    badWords.forEach(word => {
      const regexPattern = word.split("").map(char => {
        const replacements: Record<string, string> = {
          a: "[aA4@]",
          m: "[mM]",
          g: "[gG]",
          o: "[oO0]",
          t: "[tT7]",
          e: "[eE3]",
          r: "[rR]",
          k: "[kK]",
          c: "[cC]",
          i: "[iI1!]",
          y: "[yY]",
          b: "[bB]",
          l: "[lL1]",
          d: "[dD]",
          u: "[uU]",
          n: "[nN]",
          s: "[sS5$]",
          4: "[4Aa@]",
          3: "[3Ee]",  
          5: "[5Ss$]" 
        };
        return replacements[char] || char;
      }).join(".*?");
      const regex = new RegExp(regexPattern, "gi");
      filteredName = filteredName.replace(regex, "****");
    });
    return filteredName;
  };

  const handleGameOver = () => {
    if (gameOverFlag.current) return;
    gameOverFlag.current = true;

    setGameOver(true);
    setIsPlaying(false);
    setIsPaused(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }
    
    const name = prompt('Game Over! Enter your name:');
    if (name) {
      const filteredName = filterBadWords(name.trim());
      push(ref(db, 'leaderboard'), {
        name: filteredName,
        score: scoreRef.current,
        timestamp: Date.now()
      });
    }
  };

  const startGame = () => {
    setSnake([{ x: 12, y: 12 }]);
    setFood(generateFood());
    setDirection(null);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    gameOverFlag.current = false;
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }
  };

  const togglePause = () => {
    if (!isPlaying || gameOver) return;
    if (!isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Snake Game</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">How to Play</h2>
            </div>
            <Instructions />
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="text-white text-xl">Score: {score}</div>
                <div className="flex gap-2">
                  {isPlaying && (
                    <button
                      type="button"
                      onClick={togglePause}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={startGame}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    {isPlaying ? 'Restart' : 'Start Game'}
                  </button>
                </div>
              </div>
              <div className="relative">
                <GameBoard
                  snake={snake}
                  food={food}
                  gridSize={GRID_SIZE}
                  cellSize={CELL_SIZE}
                />
                {isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl pointer-events-none">
                    <div className="text-white text-2xl font-bold">PAUSED</div>
                  </div>
                )}
              </div>
              <div className="lg:hidden mt-4">
                <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => !isPaused && setDirection('UP')}
                    className="p-3 bg-white/20 rounded-lg"
                    disabled={isPaused}
                  >
                    <ArrowUp className="w-6 h-6 text-white" />
                  </button>
                  <div></div>
                  <button
                    type="button"
                    onClick={() => !isPaused && setDirection('LEFT')}
                    className="p-3 bg-white/20 rounded-lg"
                    disabled={isPaused}
                  >
                    <ArrowLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => !isPaused && setDirection('DOWN')}
                    className="p-3 bg-white/20 rounded-lg"
                    disabled={isPaused}
                  >
                    <ArrowDown className="w-6 h-6 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => !isPaused && setDirection('RIGHT')}
                    className="p-3 bg-white/20 rounded-lg"
                    disabled={isPaused}
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">High Scores</h2>
            </div>
            <Leaderboard scores={highScores} />
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
