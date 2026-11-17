import { useState } from 'react';
import { getProgressiveHints } from '../../../models/TutorialModel';
import './Tutorial.css';

export default function QuestionHelp({ question, onReview }) {
  const [count, setCount] = useState(0);
  const hints = getProgressiveHints(question);
  return (
    <aside className="question-help" aria-label="Ajuda da Mestra Álgebra">
      <div className="question-help-actions">
        <button type="button" className="show-explanation-btn" onClick={onReview}>📖 Rever explicação (pausa o tempo)</button>
        <button type="button" className="show-explanation-btn" disabled={count >= hints.length} onClick={() => setCount((prev) => prev + 1)}>
          💡 {count ? 'Próxima dica' : 'Preciso de uma dica'} ({count}/{hints.length})
        </button>
      </div>
      {count > 0 && <ol className="question-hints" aria-live="polite">{hints.slice(0, count).map((hint) => <li key={hint}>{hint}</li>)}</ol>}
    </aside>
  );
}
