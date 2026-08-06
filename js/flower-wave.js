
/* flower-wave.js
   時光解析 研究用 花波形描画（ひな形）
*/

const FLOWER_ORDER = [
  "kan","ju","ri","toki","dou","kyou",
  "an","seki","gen","jou","shin","hou"
];

const FLOWER_LABELS = [
  "感","受","理","時","動","境",
  "安","関","現","情","信","放"
];

function drawFlowerWave(heavenEarth){
  const root = document.getElementById("flower-wave");
  if(!root) return;

  const size = 520;
  const cx = size/2;
  const cy = size/2;
  const maxRadius = 180;

  const values = FLOWER_ORDER.map(k=>Number(heavenEarth[k]||0));

  let points = [];

  values.forEach((v,i)=>{
    const angle = (-90 + i*30) * Math.PI/180;
    const r = (v/60)*maxRadius;
    const x = cx + Math.cos(angle)*r;
    const y = cy + Math.sin(angle)*r;
    points.push([x,y]);
  });

  let d="";
  points.forEach((p,i)=>{
    d += (i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)+" ";
  });
  d += "Z";

  const labels = FLOWER_LABELS.map((t,i)=>{
    const angle=(-90+i*30)*Math.PI/180;
    const r=maxRadius+28;
    const x=cx+Math.cos(angle)*r;
    const y=cy+Math.sin(angle)*r;
    return `<text x="${x}" y="${y}" font-size="14" text-anchor="middle">${t}</text>`;
  }).join("");

  root.innerHTML = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${cx}" cy="${cy}" r="${maxRadius}" fill="none" stroke="#ddd"/>
    <path d="${d}" fill="rgba(120,120,120,.15)" stroke="#444" stroke-width="2"/>
    ${labels}
  </svg>`;
}
