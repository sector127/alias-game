import { useAliasGame } from '@/hooks/useAliasGame';
import ThemeAmbientOverlay from '@/components/ThemeAmbientOverlay';
import ThemeSelectorModal from '@/components/ThemeSelectorModal';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SetupScreen } from '@/components/screens/SetupScreen';
import { ReadyScreen } from '@/components/screens/ReadyScreen';
import { CountdownScreen } from '@/components/screens/CountdownScreen';
import { PlayingScreen } from '@/components/screens/PlayingScreen';
import { TurnEndScreen } from '@/components/screens/TurnEndScreen';
import { GameEndScreen } from '@/components/screens/GameEndScreen';
import { RulesModal } from '@/components/modals/RulesModal';
import { ConfirmRestartModal } from '@/components/modals/ConfirmRestartModal';
import { playModalSound, playToggleSound, playButtonTapSound } from '@/lib/sounds';

export default function AliasGame() {
  const game = useAliasGame();

  return (
    <main
      className={`min-h-[100dvh] h-[100dvh] ${game.activeTheme.mainBgClass} flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden relative transition-colors duration-500`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 8px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 8px)',
      }}
    >
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-500">
        {game.activeTheme.glowOrbs.map((orb, idx) => (
          <div key={idx} className={orb.className} style={orb.style} />
        ))}
      </div>

      {/* Theme Ambient Overlay (Snowflakes for winter, sparkles for summer, etc.) */}
      <ThemeAmbientOverlay theme={game.currentTheme} />

      {/* Main Glassmorphic Container */}
      <div
        className={`w-full max-w-xl ${game.activeTheme.containerBg} border ${game.activeTheme.containerBorder} rounded-3xl ${game.activeTheme.containerShadow} flex flex-col justify-between overflow-hidden relative z-10 flex-1 min-h-0 transition-all duration-300`}
      >
        {/* Header Bar */}
        <Header
          currentTheme={game.currentTheme}
          activeTheme={game.activeTheme}
          soundEnabled={game.soundEnabled}
          gameState={game.gameState}
          onOpenThemeModal={() => {
            playModalSound(true, game.soundEnabled);
            game.setShowThemeModal(true);
          }}
          onToggleSound={() => {
            const nextState = !game.soundEnabled;
            playToggleSound(nextState, true);
            game.setSoundEnabled(nextState);
          }}
          onOpenRulesModal={() => {
            playModalSound(true, game.soundEnabled);
            game.setShowRulesModal(true);
          }}
          onTogglePause={() => {
            playButtonTapSound(game.soundEnabled);
            game.setGameState(game.gameState === 'paused' ? 'playing' : 'paused');
          }}
          onOpenConfirmRestart={() => game.setShowConfirmRestart(true)}
        />

        {/* 1. Multi-step Setup Screen */}
        {game.gameState === 'setup' && (
          <SetupScreen
            setupStep={game.setupStep}
            setSetupStep={game.setSetupStep}
            teams={game.teams}
            onAddTeam={game.handleAddTeam}
            onRemoveTeam={game.handleRemoveTeam}
            onTeamNameChange={game.handleTeamNameChange}
            selectedCategories={game.selectedCategories}
            onToggleCategory={game.toggleCategory}
            roundTime={game.roundTime}
            setRoundTime={game.setRoundTime}
            winningScore={game.winningScore}
            setWinningScore={game.setWinningScore}
            controlMode={game.controlMode}
            setControlMode={game.setControlMode}
            skipPenalty={game.skipPenalty}
            setSkipPenalty={game.setSkipPenalty}
            partyModeEnabled={game.partyModeEnabled}
            setPartyModeEnabled={game.setPartyModeEnabled}
            soundEnabled={game.soundEnabled}
            activeTheme={game.activeTheme}
            onStartGame={game.handleStartGame}
          />
        )}

        {/* 2. Ready Screen */}
        {game.gameState === 'ready' && (
          <ReadyScreen
            isTieBreaker={game.isTieBreaker}
            roundNumber={game.roundNumber}
            currentTeamIndex={game.currentTeamIndex}
            currentTeam={game.currentTeam}
            teamTheme={game.teamTheme}
            winningScore={game.winningScore}
            partyModeEnabled={game.partyModeEnabled}
            currentChallenge={game.currentChallenge}
            sortedTeams={game.sortedTeams}
            soundEnabled={game.soundEnabled}
            onStartCountdown={game.startCountdown}
          />
        )}

        {/* 3. Countdown Screen (3-2-1) */}
        {game.gameState === 'countdown' && (
          <CountdownScreen
            currentTeam={game.currentTeam}
            countdownValue={game.countdownValue}
            activeTheme={game.activeTheme}
          />
        )}

        {/* 4. Active Playing & Paused Screen */}
        {(game.gameState === 'playing' || game.gameState === 'paused') && (
          <PlayingScreen
            gameState={game.gameState}
            currentTeamIndex={game.currentTeamIndex}
            currentTeam={game.currentTeam}
            teamTheme={game.teamTheme}
            timeLeft={game.timeLeft}
            partyModeEnabled={game.partyModeEnabled}
            currentChallenge={game.currentChallenge}
            currentStreak={game.currentStreak}
            currentWord={game.currentWord}
            turnWordsCount={game.currentTurnWords.length}
            controlMode={game.controlMode}
            soundEnabled={game.soundEnabled}
            activeTheme={game.activeTheme}
            onCorrect={game.handleCorrect}
            onSkip={game.handleSkip}
            onTogglePause={() => {
              game.setGameState(game.gameState === 'paused' ? 'playing' : 'paused');
            }}
            onToggleControlMode={() => {
              game.setControlMode((prev) =>
                prev === 'both' ? 'swipe' : prev === 'swipe' ? 'buttons' : 'both'
              );
            }}
          />
        )}

        {/* 5. Turn End Word Review Screen */}
        {game.gameState === 'turnEnd' && (
          <TurnEndScreen
            currentTeam={game.currentTeam}
            winningScore={game.winningScore}
            partyModeEnabled={game.partyModeEnabled}
            currentChallenge={game.currentChallenge}
            challengeCompleted={game.challengeCompleted}
            onToggleChallengeCompleted={game.toggleChallengeCompleted}
            currentTurnWords={game.currentTurnWords}
            skipPenalty={game.skipPenalty}
            onToggleTurnWordStatus={game.toggleTurnWordStatus}
            soundEnabled={game.soundEnabled}
            onConfirmTurnEnd={game.handleConfirmTurnEnd}
          />
        )}

        {/* 6. Game Over / Winner Ceremony Screen */}
        {game.gameState === 'gameEnd' && (
          <GameEndScreen
            windowSize={game.windowSize}
            activeTheme={game.activeTheme}
            sortedTeams={game.sortedTeams}
            totalMatchCorrect={game.totalMatchCorrect}
            roundNumber={game.roundNumber}
            winningScore={game.winningScore}
            soundEnabled={game.soundEnabled}
            onRematch={game.handleRematch}
            onResetToSetup={game.handleResetToSetup}
          />
        )}

        {/* Footer info bar */}
        <Footer
          activeTheme={game.activeTheme}
          skipPenalty={game.skipPenalty}
          winningScore={game.winningScore}
        />
      </div>

      {/* Rules Modal */}
      <RulesModal
        isOpen={game.showRulesModal}
        onClose={() => game.setShowRulesModal(false)}
        activeTheme={game.activeTheme}
        soundEnabled={game.soundEnabled}
      />

      {/* Confirm Restart Modal */}
      <ConfirmRestartModal
        isOpen={game.showConfirmRestart}
        onClose={() => game.setShowConfirmRestart(false)}
        onConfirm={game.handleResetToSetup}
        soundEnabled={game.soundEnabled}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={game.showThemeModal}
        onClose={() => game.setShowThemeModal(false)}
        currentTheme={game.currentTheme}
        onSelectTheme={game.handleSelectTheme}
        soundEnabled={game.soundEnabled}
      />
    </main>
  );
}
