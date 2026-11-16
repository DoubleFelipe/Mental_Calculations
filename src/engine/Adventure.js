import worlds from '../data/worlds.js';
import { WORLD_NPCS_MAP } from './Platform.js';
export function adventureCharacters(platforms, worldIndex, progress) {
  const definitions = WORLD_NPCS_MAP[worldIndex] || WORLD_NPCS_MAP[3];
  return definitions.map((d, levelIndex) => {
    const p = progress[levelIndex] || {};
    const count = worlds[worldIndex].levels[levelIndex].questionsCount;
    const charge = Math.min(p.charge || 0, count - 1);
    const start = platforms[d.platformIndex];
    const end = definitions[levelIndex+1] ? platforms[definitions[levelIndex+1].platformIndex].x : Infinity;
    const route = platforms.map((plat, i) => ({plat, i})).filter(({plat}) => !plat.secret && plat.energyLevel === undefined && !plat.id?.includes('secret') && plat.x >= start.x && plat.x < end).sort((a,b)=>a.plat.x-b.plat.x);
    const chosen = levelIndex === 4 ? {plat:start,i:d.platformIndex} : route[Math.floor(charge * route.length / count)] || {plat:start,i:d.platformIndex};
    return { width:30, height:50, x:0, y:0, platformIndex:chosen.i, offsetRatio: levelIndex === 4 ? (charge % 2 ? .8 : .15) : .15,
      levelIndex, phaseName:levelIndex === 4 ? worlds[worldIndex].boss : ['Portão matemático','Cristal de energia','Ponte de luz','Mecanismo antigo'][levelIndex],
      levelName:worlds[worldIndex].levels[levelIndex].name, message:p.stars ? 'Energia restaurada !' : levelIndex === 4 ? 'Ative os selos. Salte sobre a onda!' : `Selo ${charge+1}/${count} · Resolva para restaurar o caminho.`,
      color:worlds[worldIndex].color, locked:!p.unlocked, completed:p.stars > 0, stars:p.stars || 0, charge, count, activated:false, type:levelIndex === 4 ? 'boss' : 'mechanism', worldIndex };
  });
}
export function drawAdventureActor(ctx, npc, cameraX, cameraY, frame) {
  const x=npc.x-cameraX+15, y=npc.y-cameraY;
  ctx.save();ctx.strokeStyle=npc.locked?'#607d8b':npc.color;ctx.fillStyle='#112e3d';ctx.lineWidth=3;
  ctx.shadowColor=npc.color;ctx.shadowBlur=npc.completed?0:12+Math.sin(frame*.05)*5;
  if(npc.type==='boss') {
    if(npc.worldIndex===1 || npc.worldIndex===2) {
      ctx.beginPath();ctx.ellipse(x,y+25,23,17,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-14,y+15+i*7);ctx.lineTo(x-35,y+8+i*12);ctx.moveTo(x+14,y+15+i*7);ctx.lineTo(x+35,y+8+i*12);ctx.stroke();}
      if(npc.worldIndex===2){ctx.beginPath();ctx.moveTo(x+22,y+22);ctx.quadraticCurveTo(x+60,y-20,x+24,y-25);ctx.stroke();}
    } else if(npc.worldIndex===4) {
      ctx.beginPath();ctx.ellipse(x,y+18,24,38,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#f48fb1';ctx.font='bold 38px sans-serif';ctx.textAlign='center';ctx.fillText('∅',x,y+31);
    } else {
      ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x-25,y+46);ctx.lineTo(x+25,y+46);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=npc.color;ctx.font='bold 25px sans-serif';ctx.textAlign='center';ctx.fillText(npc.worldIndex===3?'X':'?',x,y+28);
    }
    ctx.shadowBlur=0;ctx.fillStyle='#081a28';ctx.fillRect(x-42,y-38,84,7);ctx.fillStyle=npc.color;ctx.fillRect(x-42,y-38,84*(npc.completed?0:1-npc.charge/npc.count),7);
  } else {
    ctx.translate(x,y+24);ctx.rotate(Math.sin(frame*.025)*.08);ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(17,0);ctx.lineTo(0,26);ctx.lineTo(-17,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=npc.color;ctx.font='bold 19px sans-serif';ctx.textAlign='center';ctx.fillText(npc.completed?'✓':['+','×','½','x','△'][npc.worldIndex],0,6);
  }
  ctx.restore();ctx.save();ctx.textAlign='center';ctx.font='bold 12px sans-serif';ctx.fillStyle='#071c29';ctx.fillRect(x-90,y-74,180,25);ctx.fillStyle=npc.locked?'#aaa':npc.color;ctx.fillText(npc.completed?'✓ Caminho restaurado':npc.phaseName,x,y-57);ctx.restore();
}
export function drawMathGate(ctx, x, cameraX, height, openness, color) {
  if(openness>=1)return;
  ctx.save();ctx.globalAlpha=1-openness;ctx.strokeStyle=color;ctx.lineWidth=4;
  for(let y=0;y<height;y+=30){ctx.beginPath();ctx.moveTo(x-cameraX-6,y);ctx.lineTo(x-cameraX+6,y+20);ctx.stroke();}
  ctx.fillStyle=color;ctx.font='bold 22px sans-serif';ctx.fillText('∑',x-cameraX-9,80);ctx.restore();
}

export function drawMentor(ctx,cameraX,cameraY,frame){
  const x=260-cameraX,y=470-cameraY;
  ctx.save();ctx.strokeStyle='#e6d8ff';ctx.fillStyle='#725b9c';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x,y+15);ctx.lineTo(x-17,y+50);ctx.lineTo(x+17,y+50);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff0d7';ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x-11,y+15);ctx.lineTo(x+11,y+15);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#493a65';ctx.beginPath();ctx.arc(x-4,y+9,3,0,Math.PI*2);ctx.arc(x+4,y+9,3,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#e6d8ff';ctx.beginPath();ctx.moveTo(x+20,y+50);ctx.lineTo(x+20,y+6);ctx.stroke();ctx.fillStyle='#ffd782';ctx.beginPath();ctx.arc(x+20,y+5,4+Math.sin(frame*.04),0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#102b35';ctx.fillRect(x-65,y-30,130,22);ctx.fillStyle='#e6d8ff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('Mestra Álgebra',x,y-15);ctx.restore();
}
