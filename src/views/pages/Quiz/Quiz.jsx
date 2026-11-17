/**
 * Mental Calculations — Tela de Quiz (View)
 * Mostra questões uma por vez com timer desacoplado, feedback diagnóstico e rodada de fixação.
 */
import { useState } from 'react';
import useQuizController from '../../../controllers/useQuizController';
import useGameState from '../../../controllers/GameController';
import { getStoryPlayerKey } from '../../../models/StoryModel';
import { getLevelTutorialIds, getPendingTutorialIds, getQuestionTutorialId } from '../../../models/TutorialModel';
import { TUTORIALS } from '../../../data/tutorials';
import Tutorial from '../../components/Tutorial/Tutorial';
import QuestionHelp from '../../components/Tutorial/QuestionHelp';
import Whiteboard from '../../components/Whiteboard/Whiteboard.jsx';
import { WORLD_STORIES } from '../../../data/story';
import '../../components/Story/Story.css';
import './Quiz.css';

export default function Quiz({ worldIndex, levelIndex, onComplete, onExit }) {
  const { gameState, authUser, markTutorialsComplete } = useGameState();
  const pendingTutorials = getPendingTutorialIds(gameState, getStoryPlayerKey(authUser), worldIndex, levelIndex);
  const lessonIds = getLevelTutorialIds(worldIndex, levelIndex);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  // Capture a sessão para que salvar o progresso não altere a lição em leitura.
  const [tutorialSession, setTutorialSession] = useState(() => pendingTutorials.length ? { ids: pendingTutorials, review: false } : null);
  const {
    level,
    difficulty,
    selectedDifficultyLabel,
    questionsCount,
    timeLimit,
    questions,
    currentQ,
    selected,
    showFeedback,
    isCorrect,
    selectedDiagnostic,
    showExplanation,
    setShowExplanation,
    showIntro,
    startQuiz,
    isStarting,
    timeLeft,
    percentage,
    isApprenticeMode,
    toggleApprenticeMode,
    isReviewPhase,
    handleAnswer,
    handleNext,
    activatePowerUp,
    hiddenAlternatives,
    powerUpMessage,
    powerUpUses,
    shieldActive,
  } = useQuizController({ worldIndex, levelIndex, onComplete, isStudyPaused: showWhiteboard || !!tutorialSession });

  const btnColors = ['chalk-btn-green', 'chalk-btn-blue', 'chalk-btn-red', 'chalk-btn-yellow'];
  const isFinalBattle = worldIndex === 3 && levelIndex === 4;

  const handleExit = () => {
    if (!showIntro && !window.confirm('Sair desta fase? O resultado desta tentativa não será salvo.')) return;
    onExit?.();
  };

  const tutorialView = tutorialSession && (
      <Tutorial ids={tutorialSession.ids} review={tutorialSession.review}
        onClose={() => setTutorialSession(null)}
        onComplete={() => {
          if (!tutorialSession.review) markTutorialsComplete(tutorialSession.ids);
          setTutorialSession(null);
        }} />
  );

  // Tela de introdução/explicação
  if (showIntro) {
    return (
      <div className="quiz-page chalkboard chalkboard-frame animate-fadeIn">
        {tutorialView}
        <div className="quiz-content" hidden={!!tutorialSession}>
        <div className="quiz-intro">
          <h2 className="chalk-text-strong">📐 {level?.name}</h2>
          <p className="story-objective"><strong>{isFinalBattle ? '∅ Confronto com Zero Absoluto' : '🧭 Missão de Léo'}</strong><br />{WORLD_STORIES[worldIndex].levels[levelIndex]}</p>
          <p className="chalk-text">📐 Mestra Álgebra: {pendingTutorials.length ? 'Vamos preparar os conhecimentos desta fase antes de começar!' : 'Você concluiu a preparação! Vamos usar o que aprendeu para ajudar Numeria.'}</p>
          <ul className="quiz-lesson-list">{lessonIds.map((id) => <li key={id}>{pendingTutorials.includes(id) ? '○' : '✓'} {TUTORIALS[id].title}</li>)}</ul>
          <div className="intro-info">
            <span>📝 {questionsCount} questões</span>
            <span>⏱️ {timeLimit}s por questão ({selectedDifficultyLabel})</span>
            <span>📊 Nível: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
          </div>
          <button className="chalk-btn chalk-btn-blue" onClick={() => setTutorialSession({ ids: pendingTutorials.length ? pendingTutorials : lessonIds, review: !pendingTutorials.length })}>
            {pendingTutorials.length ? 'Continuar preparação →' : '📖 Rever conteúdo'}
          </button>
          <button className="chalk-btn chalk-btn-green" disabled={pendingTutorials.length > 0 || isStarting} onClick={startQuiz}>
            {isStarting ? 'Preparando fase…' : 'Começar! →'}
          </button>
          <button className="chalk-btn chalk-btn-red quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">
            ← Sair da fase
          </button>
        </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQ] || questions[0];

  return (
    <div className="quiz-page chalkboard chalkboard-frame">
      {tutorialView}
      <div className="quiz-content" hidden={!!tutorialSession}>
      {/* Header com Timer Desacoplado */}
      <div className="quiz-header">
        <span className="quiz-counter">
          {isReviewPhase ? '🔄 Fixação: ' : ''}
          {currentQ + 1} / {questions.length}
        </span>

        <div className={`quiz-timer ${showWhiteboard ? 'paused' : isApprenticeMode ? 'apprentice' : percentage < 30 ? 'danger' : percentage < 60 ? 'warning' : ''}`}>
          {isApprenticeMode ? (
            <span>⏱️ ∞ Modo Aprendiz</span>
          ) : showWhiteboard ? (
            <span>⏱️ Pausado (Quadro)</span>
          ) : (
            <>
              ⏱️ {timeLeft}s
              <div className="timer-bar">
                <div className="timer-fill" style={{ width: `${percentage}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="quiz-header-controls">
          <button
            className={`chalk-mode-btn ${isApprenticeMode ? 'active' : ''}`}
            onClick={toggleApprenticeMode}
            title="Ative o Modo Aprendiz para raciocinar sem pressão de tempo"
            type="button"
          >
            {isApprenticeMode ? '🎓 Modo Aprendiz (Ativo)' : '⏱️ Sem pressa?'}
          </button>
          <span className="quiz-diff">{question.difficulty}</span>
        </div>
      </div>

      {isFinalBattle && (
        <div key={`${isReviewPhase}-${currentQ}-${showFeedback}`} className={`story-battle ${showFeedback && isCorrect ? 'story-battle-hit' : ''}`} role="status">
          <span className="story-battle-symbol" aria-hidden="true">∅</span>
          <div><strong>Zero Absoluto · Desafio Supremo</strong><p>
            {showFeedback
              ? isCorrect ? 'Léo: Mais uma luz no Coração! Sua sombra está perdendo força.' : 'Mestra Álgebra: Respire, observe a resolução e siga aprendendo. Estamos com você!'
              : isReviewPhase ? 'Mestra Álgebra: Revise suas descobertas para fortalecer o que aprendeu.' : 'Léo reúne os fragmentos. Cada acerto ilumina Numeria!'}
          </p></div>
        </div>
      )}

      {/* Banner de Rodada de Fixação / Repescagem */}
      {isReviewPhase && (
        <div className="review-banner animate-bounceIn">
          <span>🔄 <strong>Rodada de Fixação Pedagógica:</strong> Refaça os pontos de dúvida para consolidar o aprendizado!</span>
        </div>
      )}

      {/* Progresso */}
      <div className="quiz-progress-dots">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`q-dot ${i === currentQ ? 'current' : i < currentQ ? 'done' : ''}`}
          />
        ))}
      </div>

      {/* Questão */}
      <div className="quiz-question animate-fadeInUp">
        {question.topic && <div className="quiz-topic-badge">📚 {question.topic}</div>}
        <p className="question-text chalk-text-strong">{question.text}</p>
        
        <div className="quiz-wb-toggle" style={{ marginTop: 12 }}>
          <button
            className={`chalk-btn ${showWhiteboard ? 'chalk-btn-yellow' : 'chalk-btn-blue'}`}
            onClick={() => setShowWhiteboard((s) => !s)}
          >
            {showWhiteboard ? '✖ Fechar Quadro de Apoio' : '📐 Abrir Quadro de Apoio (Pausa o tempo)'}
          </button>
        </div>
      </div>

      <QuestionHelp key={`${isReviewPhase}-${currentQ}`} question={question}
        onReview={() => setTutorialSession({ ids: [getQuestionTutorialId(question), ...lessonIds.filter((id) => id !== getQuestionTutorialId(question))], review: true })} />

      {showWhiteboard && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Whiteboard question={question} />
        </div>
      )}

      {/* Power-ups */}
      <div className="quiz-powerups" aria-label="Consumíveis">
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_hint')} disabled={showFeedback || !powerUpUses.item_hint}>
          💡 Dica ({powerUpUses.item_hint || 0})
        </button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_time')} disabled={showFeedback || isApprenticeMode || !powerUpUses.item_time}>
          ⏰ +15s ({powerUpUses.item_time || 0})
        </button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_shield')} disabled={showFeedback || shieldActive || !powerUpUses.item_shield}>
          🛡️ Escudo ({powerUpUses.item_shield || 0})
        </button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_double')} disabled={showFeedback || !powerUpUses.item_double}>
          ✨ Dobrar ({powerUpUses.item_double || 0})
        </button>
      </div>
      {powerUpMessage && <div className="powerup-message">{powerUpMessage}</div>}

      {/* Alternativas com Distratores */}
      <div className="quiz-alternatives">
        {question.alternatives.map((alt, i) => {
          let extraClass = '';
          if (showFeedback) {
            if (i === question.correctIndex) extraClass = 'correct';
            else if (i === selected && !isCorrect) extraClass = 'wrong';
          }
          const hidden = hiddenAlternatives.includes(i);
          return (
            <button
              key={i}
              className={`chalk-btn ${btnColors[i % btnColors.length]} quiz-alt ${hidden ? 'powerup-hidden' : ''} ${extraClass} ${showFeedback && i === question.correctIndex ? 'animate-pulse' : ''} ${showFeedback && i === selected && !isCorrect ? 'animate-shake' : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback || hidden || showWhiteboard}
            >
              {alt}
            </button>
          );
        })}
      </div>

      {/* Feedback Pedagógico e Diagnóstico */}
      {showFeedback && (
        <div className={`quiz-feedback animate-fadeInUp ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          {isCorrect ? (
            <div className="feedback-content">
              <span className="feedback-icon">✅</span>
              <span className="feedback-text">
                {isReviewPhase ? 'Excelente! Conceito fixado com sucesso!' : 'Correto! Muito bem!'}
              </span>
            </div>
          ) : (
            <div className="feedback-content">
              <span className="feedback-icon">❌</span>
              <span className="feedback-text">
                {timeLeft === 0 && !isApprenticeMode ? 'Tempo esgotado!' : 'Resposta incorreta!'}
              </span>

              {/* Bloco Diagnóstico Específico da Alternativa Escolhida */}
              {selectedDiagnostic && (
                <div className="diagnostic-box animate-fadeInDown">
                  <span className="diagnostic-badge-title">🎯 Diagnóstico do seu raciocínio:</span>
                  <p className="diagnostic-explanation">{selectedDiagnostic}</p>
                </div>
              )}

              <button className="show-explanation-btn" onClick={() => setShowExplanation(!showExplanation)}>
                {showExplanation ? 'Ocultar' : 'Ver'} resolução completa
              </button>
            </div>
          )}

          {showExplanation && (
            <div className="explanation-box animate-fadeInDown">
              <pre className="explanation-text">{question.explanation}</pre>
            </div>
          )}

          <button className="chalk-btn chalk-btn-green next-btn" onClick={handleNext}>
            {currentQ + 1 >= questions.length && isReviewPhase
              ? '📊 Concluir Fase'
              : currentQ + 1 >= questions.length
              ? '→ Continuar'
              : '→ Próxima'}
          </button>
        </div>
      )}

      <button className="chalk-btn chalk-btn-red quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">
        ← Sair da fase
      </button>
      </div>
    </div>
  );
}
