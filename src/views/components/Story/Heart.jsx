import { FRAGMENTS, recoveredFragments } from '../../../data/story';
export default function Heart({ gameState, large = false }) {
  const found = recoveredFragments(gameState);
  return <div className={`numeria-heart ${large ? 'large' : ''}`} aria-label={`Coração dos Cálculos: ${found.length} de 7 fragmentos`}>
    <svg viewBox="0 0 120 110" role="img" aria-label="Sete partes do Coração dos Cálculos">
      {FRAGMENTS.map((fragment, i) => {
        const angle = (i * 360/7 - 90) * Math.PI/180, next = ((i+1)*360/7-90)*Math.PI/180;
        return <path key={fragment.id} d={`M60 55 L${60+44*Math.cos(angle)} ${55+44*Math.sin(angle)} L${60+44*Math.cos(next)} ${55+44*Math.sin(next)} Z`} fill={found.some(f=>f.id === fragment.id) ? ['#a5d6a7','#80cbc4','#80deea','#90caf9','#ffe082','#b39ddb','#f48fb1'][i] : '#253d46'} stroke="#102c35" strokeWidth="3"><title>{fragment.name}</title></path>;
      })}
      <text x="60" y="62" textAnchor="middle" fill="white" fontSize="23">∑</text>
    </svg><span>{found.length}/7 fragmentos</span>
  </div>;
}
