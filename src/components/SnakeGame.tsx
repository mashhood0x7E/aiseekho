/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't spawn food on snake body
      const onSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(spawnFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, spawnFood]);

  const gameLoop = useCallback(
    (time: number) => {
      if (gameState !== GameState.PLAYING) return;

      if (time - lastUpdateRef.current > GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, moveSnake]
  );

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(gameLoopRef.current);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, gameLoop]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState(GameState.PLAYING);
    setFood(spawnFood(INITIAL_SNAKE));
  }, [spawnFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === GameState.PLAYING) {
          setGameState(GameState.IDLE);
        } else {
          if (gameState === GameState.GAME_OVER) {
            startGame();
          } else {
            setGameState(GameState.PLAYING);
          }
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0c'; // Very dark grey, almost black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a20';
    ctx.lineWidth = 0.5;
    const cellSize = canvas.width / GRID_SIZE;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (neon pink)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);

    // Draw snake (neon green)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffcc' : '#00ff66';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff66';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Reset shadow for performance
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
          System.Snake
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="font-mono text-sm text-cyan-400">{score.toString().padStart(6, '0')}</span>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full rounded-lg border border-cyan-500/30"
        />

        <AnimatePresence>
          {gameState !== GameState.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              {gameState === GameState.GAME_OVER && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-3xl font-black text-rose-500 mb-2 uppercase italic tracking-tighter">
                    Critical Error
                  </h3>
                  <p className="text-white/60 mb-1">Neural Connection Terminated</p>
                  <p className="text-cyan-400 font-mono text-xl">Score: {score}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                {gameState === GameState.IDLE ? (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    INITIALIZE
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    REBOOT
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-4 text-[10px] uppercase font-mono text-white/30">
        <span>[WASD] Navigate</span>
        <span>[SPACE] Pause</span>
        <span className="ml-auto">V1.0.4-BETA</span>
      </div>
    </div>
  );
}
