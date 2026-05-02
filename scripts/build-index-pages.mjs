#!/usr/bin/env node
/**
 * build-index-pages.mjs · 학생용/강사용 인덱스 HTML 자동 생성
 *
 * 출력: output/index.html (학생용 · ?view=student) · output/teacher.html (강사용 · ?view=teacher)
 *
 * - LLM 호출 0
 * - 관악강의 디자인 톤 (bgcanvas · 커서 · gold 팔레트)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LECTURE_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(LECTURE_ROOT, 'output');

function listSessions() {
  return fs.readdirSync(OUTPUT_DIR)
    .filter(d => /^\d{2}강_/.test(d))
    .sort()
    .map(d => {
      const num = d.slice(0, 2);
      const titleSlug = d.slice(4).replace(/_/g, ' ');
      const pptPath = path.join(OUTPUT_DIR, d, 'PPT', `part-${num}.html`);
      return {
        num,
        folder: d,
        title: titleSlug,
        hasHtml: fs.existsSync(pptPath),
      };
    });
}

const ACT_MAP = {
  '01': 'ACT 1 · 입문',  '02': 'ACT 1 · 입문',  '03': 'ACT 1 · 입문',
  '04': 'ACT 2 · 이미지', '05': 'ACT 2 · 이미지', '06': 'ACT 2 · 이미지', '07': 'ACT 2 · 이미지', '08': 'ACT 2 · 이미지',
  '09': 'ACT 3 · 영상',  '10': 'ACT 3 · 영상',  '11': 'ACT 3 · 영상',  '12': 'ACT 3 · 영상',  '13': 'ACT 3 · 영상',
  '14': 'ACT 4 · 마케팅', '15': 'ACT 4 · 마케팅', '16': 'ACT 4 · 마케팅', '17': 'ACT 4 · 마케팅',
  '18': 'ACT 5 · 실전',  '19': 'ACT 5 · 실전',  '20': 'ACT 5 · 실전',
};

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHtml({ view, title, sessions }) {
  const isStudent = view === 'student';
  const cardLinks = sessions.filter(s => s.hasHtml).map(s => {
    const url = `./${s.folder}/PPT/part-${s.num}.html?view=${view}`;
    const act = ACT_MAP[s.num] || '';
    return `        <a class="card available" href="${url}">
          <div class="card-inner">
            <div class="card-num"><span>${parseInt(s.num)}회</span><span class="tutor">${act}</span></div>
            <div class="card-title">${escapeHtml(s.title)}</div>
            <div class="card-desc">${escapeHtml(s.title)} · 30분</div>
            <div class="card-meta"><span>열기</span><span class="arrow">→</span></div>
            <div class="card-glow"></div>
          </div>
        </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} — 힉스필드 풀코스</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<style>
  :root {
    --black: #0D0D0D; --ink: #141414;
    --gold: #e2c793; --gold-soft: #b8941f;
    --cream: #F7F0DF; --text: #E8E0CC;
    --muted: #7a7666; --dim: #3a3730;
    --border: #1f1d19;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: var(--black); color: var(--text); font-family: 'Pretendard Variable', 'Pretendard', sans-serif; letter-spacing: -0.01em; }
  body { min-height: 100vh; overflow-x: hidden; cursor: none; }
  canvas#bgcanvas { position: fixed; inset: 0; z-index: 0; opacity: 0.45; pointer-events: none; }
  .dot-grid { position: fixed; inset: 0; z-index: 1; opacity: 0.06; pointer-events: none; background-image: radial-gradient(circle, var(--gold) 1px, transparent 1px); background-size: 40px 40px; }
  .vignette { position: fixed; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%); }
  .cursor-dot, .cursor-ring { position: fixed; z-index: 9999; pointer-events: none; left: 0; top: 0; transition: transform 0.05s ease-out; }
  .cursor-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 12px var(--gold); }
  .cursor-ring { width: 38px; height: 38px; border: 1px solid var(--gold); border-radius: 50%; opacity: 0.5; transition: width 0.2s, height 0.2s, opacity 0.2s; transform: translate(-19px, -19px); }
  main { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px); }
  .hero { text-align: center; padding: clamp(60px, 10vw, 120px) 0 clamp(40px, 6vw, 80px); }
  .brand-pill { display: inline-flex; align-items: center; gap: 12px; padding: 8px 24px; border: 1px solid var(--gold); border-radius: 100px; font-size: 12px; font-weight: 900; letter-spacing: 5px; color: var(--gold); margin-bottom: 32px; }
  .brand-pill::before { content: ''; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 8px var(--gold); animation: spin 3s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hero h1 { font-size: clamp(38px, 5.5vw, 86px); font-weight: 900; color: var(--cream); line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.02em; }
  .word { display: inline-block; opacity: 0; transform: translateY(40px); animation: wordIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  @keyframes wordIn { to { opacity: 1; transform: translateY(0); } }
  .hero p.sub { font-size: clamp(16px, 1.4vw, 22px); color: var(--muted); margin-bottom: 32px; }
  .stats { display: flex; justify-content: center; gap: clamp(20px, 3vw, 40px); flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--gold-soft); }
  .stats span { display: inline-flex; align-items: center; gap: 8px; }
  .stats span::before { content: '·'; color: var(--gold); }
  .courses { padding: 40px 0; }
  .courses h2 { font-size: clamp(24px, 2.4vw, 36px); font-weight: 900; color: var(--cream); margin-bottom: 32px; text-align: center; }
  .courses h2::after { content: ''; display: block; width: 60px; height: 2px; background: var(--gold); margin: 16px auto 0; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .card { display: block; text-decoration: none; color: inherit; position: relative; overflow: hidden; transition: transform 0.3s; }
  .card:hover { transform: translateY(-4px); }
  .card-inner { padding: 24px; background: linear-gradient(135deg, rgba(226,199,147,0.04), rgba(13,13,13,0.4)); border: 1px solid var(--border); border-radius: 8px; position: relative; height: 100%; transition: border-color 0.3s; }
  .card:hover .card-inner { border-color: var(--gold); }
  .card-num { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--gold); }
  .tutor { color: var(--muted); font-weight: 400; }
  .card-title { font-size: 18px; font-weight: 700; color: var(--cream); margin-bottom: 12px; line-height: 1.4; }
  .card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; min-height: 42px; }
  .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gold-soft); }
  .arrow { font-size: 16px; transition: transform 0.3s; }
  .card:hover .arrow { transform: translateX(4px); }
  .card-glow { position: absolute; inset: 0; border-radius: 8px; opacity: 0; background: radial-gradient(circle at top right, rgba(226,199,147,0.15), transparent 70%); transition: opacity 0.3s; pointer-events: none; }
  .card:hover .card-glow { opacity: 1; }
  footer { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); margin-top: 60px; }
  .view-toggle { display: inline-flex; gap: 12px; margin-top: 20px; }
  .view-toggle a { padding: 8px 20px; border: 1px solid var(--border); border-radius: 100px; color: var(--muted); text-decoration: none; font-size: 12px; }
  .view-toggle a.active { color: var(--gold); border-color: var(--gold); }
</style>
</head>
<body>
<canvas id="bgcanvas"></canvas>
<div class="dot-grid"></div>
<div class="vignette"></div>
<div class="cursor-dot"></div>
<div class="cursor-ring"></div>

<main>
  <section class="hero">
    <div class="brand-pill">힉스필드 풀코스 · ${isStudent ? '학생용' : '강사용'}</div>
    <h1>
      <span class="word">왕초보를</span>
      <span class="word" style="animation-delay:0.1s">위한</span>
      <span class="word" style="animation-delay:0.2s">힉스필드</span>
      <span class="word" style="animation-delay:0.3s">A</span>
      <span class="word" style="animation-delay:0.4s">to</span>
      <span class="word" style="animation-delay:0.5s">Z</span>
      <span class="word" style="animation-delay:0.6s">풀코스</span>
    </h1>
    <p class="sub">실전 예제로 SNS 콘텐츠·마케팅 자료 만들기 · 20회 × 30분</p>
    <div class="stats">
      <span>20회차</span>
      <span>5 ACT</span>
      <span>4 가상 클라이언트</span>
      <span>10시간 풀코스</span>
    </div>
    <div class="view-toggle">
      <a href="./index.html" class="${isStudent ? 'active' : ''}">🎓 학생용</a>
      <a href="./teacher.html" class="${!isStudent ? 'active' : ''}">🎤 강사용</a>
    </div>
  </section>

  <section class="courses">
    <h2>전체 회차 목록</h2>
    <div class="card-grid">
${cardLinks}
    </div>
  </section>
</main>

<footer>
  © PajamaBoss · 힉스필드 풀코스 · 2026<br>
  ${isStudent ? '학생용 인덱스 · 강사 노트 비표시' : '강사용 인덱스 · 강사 노트 + 📺 프로젝터 버튼 표시'}
</footer>

<script>
// 커스텀 커서
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
window.addEventListener('mousemove', (e) => {
  dot.style.transform = \`translate(\${e.clientX - 3}px, \${e.clientY - 3}px)\`;
  ring.style.transform = \`translate(\${e.clientX - 19}px, \${e.clientY - 19}px)\`;
});

// 배경 캔버스 · 단순 파티클 흐름
const canvas = document.getElementById('bgcanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  r: Math.random() * 1.5 + 0.5,
}));
function tick() {
  ctx.fillStyle = 'rgba(13,13,13,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e2c793';
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
}
tick();
</script>
</body>
</html>`;
}

const sessions = listSessions();
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), buildHtml({ view: 'student', title: '학생용 인덱스', sessions }));
fs.writeFileSync(path.join(OUTPUT_DIR, 'teacher.html'), buildHtml({ view: 'teacher', title: '강사용 인덱스', sessions }));

// .nojekyll
fs.writeFileSync(path.join(OUTPUT_DIR, '.nojekyll'), '');

console.log(`✅ output/index.html 생성 (학생용 · ${sessions.filter(s => s.hasHtml).length}개 카드)`);
console.log(`✅ output/teacher.html 생성 (강사용)`);
console.log(`✅ output/.nojekyll 생성 (한글 경로 빌드 우회)`);
