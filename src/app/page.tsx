'use client'
import { useState, useEffect, useCallback } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { ResultsDialog } from '@/components/game/ResultsDialog';
import { LeaderboardDialog } from '@/components/game/LeaderboardDialog';
import { Button } from '@/components/ui/button';
import { threadPuzzles } from '@/data/threadPuzzles';
import type { ThreadPuzzle, GameState, Cast } from '@/types/game';
import { Trophy, Play, Info, Wallet } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";
import { WalletAttribution } from '@/components/game/WalletAttribution';
import { ERC8021TestRunner } from '@/components/game/ERC8021TestRunner';
import { SendAttributedTxExample } from '@/components/game/SendAttributedTxExample';

export default function ThreadMasterPage(): JSX.Element {
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }
      }
      tryAddMiniApp()
    }, [addMiniApp])
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    lives: 3,
    combo: 0,
    timeRemaining: 45,
    isPlaying: false,
    showResults: false,
    showLeaderboard: false,
  });

  const [currentPuzzle, setCurrentPuzzle] = useState<ThreadPuzzle | null>(null);
  const [scrambledCasts, setScrambledCasts] = useState<Cast[]>([]);
  const [playerOrder, setPlayerOrder] = useState<Cast[]>([]);
  const [showERC8021, setShowERC8021] = useState(false);

  // Timer logic
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState((prev: GameState) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.isPlaying && gameState.timeRemaining === 0) {
      handleTimeUp();
    }
  }, [gameState.isPlaying, gameState.timeRemaining]);

  const handleTimeUp = (): void => {
    setGameState((prev: GameState) => ({
      ...prev,
      isPlaying: false,
      showResults: true,
      lives: prev.lives - 1,
      combo: 0,
    }));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = useCallback((): void => {
    const puzzle = threadPuzzles[gameState.currentLevel % threadPuzzles.length];
    setCurrentPuzzle(puzzle);
    const scrambled = shuffleArray(puzzle.casts);
    setScrambledCasts(scrambled);
    setPlayerOrder([]);
    setGameState((prev: GameState) => ({
      ...prev,
      isPlaying: true,
      timeRemaining: 45,
      showResults: false,
    }));
  }, [gameState.currentLevel]);

  const handleSubmit = (): void => {
    if (!currentPuzzle || playerOrder.length !== currentPuzzle.casts.length) {
      return;
    }

    const isCorrect = playerOrder.every(
      (cast: Cast, index: number) => cast.id === currentPuzzle.casts[index].id
    );

    if (isCorrect) {
      const timeBonus = gameState.timeRemaining;
      const comboMultiplier = 1 + gameState.combo * 0.5;
      const roundScore = Math.floor((500 + timeBonus) * comboMultiplier);

      setGameState((prev: GameState) => ({
        ...prev,
        score: prev.score + roundScore,
        combo: prev.combo + 1,
        currentLevel: prev.currentLevel + 1,
        isPlaying: false,
        showResults: true,
      }));
    } else {
      setGameState((prev: GameState) => ({
        ...prev,
        lives: prev.lives - 1,
        combo: 0,
        isPlaying: false,
        showResults: true,
      }));
    }
  };

  const handleContinue = (): void => {
    if (gameState.lives <= 0) {
      // Game over - save score
      saveScore(gameState.score);
      setGameState({
        currentLevel: 0,
        score: 0,
        lives: 3,
        combo: 0,
        timeRemaining: 45,
        isPlaying: false,
        showResults: false,
        showLeaderboard: false,
      });
    } else {
      startGame();
    }
  };

  const saveScore = (score: number): void => {
    try {
      const leaderboard = JSON.parse(localStorage.getItem('threadMasterLeaderboard') || '[]') as Array<{ score: number; date: string }>;
      leaderboard.push({
        score,
        date: new Date().toISOString(),
      });
      leaderboard.sort((a, b) => b.score - a.score);
      const topScores = leaderboard.slice(0, 10);
      localStorage.setItem('threadMasterLeaderboard', JSON.stringify(topScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleReorder = (newOrder: Cast[]): void => {
    setPlayerOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            🧵 Thread Master
          </h1>
          <p className="text-purple-300 text-sm">Untangle the chaos, master the thread</p>
        </header>

        {/* ERC-8021 Info Button */}
        {!gameState.isPlaying && !gameState.showResults && !gameState.showLeaderboard && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setShowERC8021(!showERC8021)}
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-800/30"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {showERC8021 ? 'Back to Game' : 'ERC-8021 Attribution'}
            </Button>
          </div>
        )}

        {/* ERC-8021 Info Screen */}
        {showERC8021 && !gameState.isPlaying && !gameState.showResults && !gameState.showLeaderboard && (
          <div className="space-y-6 pb-8">
            <SendAttributedTxExample />
            <WalletAttribution />
            <ERC8021TestRunner />
          </div>
        )}

        {/* Game start screen */}
        {!showERC8021 && !gameState.isPlaying && !gameState.showResults && (
          <div className="text-center py-12 space-y-6">
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
              <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
              <p className="text-purple-300 mb-6 max-w-md mx-auto">
                Reconstruct scrambled Farcaster threads in the correct order. 
                Drag and arrange casts before time runs out!
              </p>
              <div className="flex gap-4 justify-center mb-6">
                <div className="bg-purple-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-300">{gameState.lives}</div>
                  <div className="text-xs text-purple-400">Lives</div>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-300">{gameState.score}</div>
                  <div className="text-xs text-purple-400">Score</div>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-300">{gameState.currentLevel + 1}</div>
                  <div className="text-xs text-purple-400">Level</div>
                </div>
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Game
                </Button>
                <Button
                  onClick={() => setGameState((prev: GameState) => ({ ...prev, showLeaderboard: true }))}
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-800/50"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Leaderboard
                </Button>
              </div>
            </div>

            {/* How to play */}
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-purple-400" />
                <h3 className="text-xl font-semibold text-purple-300">How to Play</h3>
              </div>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">1.</span>
                  <span>Drag cast bubbles into the correct chronological order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">2.</span>
                  <span>Complete the thread before time runs out (45 seconds)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">3.</span>
                  <span>Build combos for score multipliers!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">4.</span>
                  <span>Perfect threads earn +500 points + time bonus</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Active game */}
        {gameState.isPlaying && currentPuzzle && (
          <>
            <ScoreDisplay
              score={gameState.score}
              combo={gameState.combo}
              lives={gameState.lives}
              timeRemaining={gameState.timeRemaining}
              level={gameState.currentLevel + 1}
            />
            <GameBoard
              scrambledCasts={scrambledCasts}
              playerOrder={playerOrder}
              onReorder={handleReorder}
              onSubmit={handleSubmit}
              canSubmit={playerOrder.length === currentPuzzle.casts.length}
            />
          </>
        )}

        {/* Results dialog */}
        <ResultsDialog
          open={gameState.showResults}
          onContinue={handleContinue}
          isCorrect={playerOrder.length > 0 && currentPuzzle !== null && playerOrder.every(
            (cast: Cast, index: number) => currentPuzzle.casts[index] && cast.id === currentPuzzle.casts[index].id
          )}
          score={gameState.score}
          combo={gameState.combo}
          lives={gameState.lives}
          level={gameState.currentLevel}
        />

        {/* Leaderboard dialog */}
        <LeaderboardDialog
          open={gameState.showLeaderboard}
          onClose={() => setGameState((prev: GameState) => ({ ...prev, showLeaderboard: false }))}
        />
      </div>
    </div>
  );
}
