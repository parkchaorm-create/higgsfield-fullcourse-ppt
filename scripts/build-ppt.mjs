#!/usr/bin/env node
/**
 * build-ppt.mjs · Higgsfield 풀코스 회차별 PPT 자동 생성
 *
 * 입력: input/script/script_parts/part-NN.md (단일 원천)
 * 출력: output/<NN강_*>/PPT/part-NN.html
 *
 * - LLM 호출 0 · Node + regex만
 * - 골든 템플릿 구조 (cover + sections + outro)
 * - SVG는 단순 패턴 (회차마다 다른 배경 모드)
 * - 강사 노트는 inject-teacher-notes.mjs로 별도 주입
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LECTURE_ROOT = path.resolve(__dirname, '..');
const SCRIPT_DIR = path.join(LECTURE_ROOT, 'input/script/script_parts');
const OUTPUT_DIR = path.join(LECTURE_ROOT, 'output');

// 회차 메타 (folder · title · short · ACT · bg-mode)
const SESSIONS = [
  { nn: '01', folder: '01강_힉스필드_첫_만남',           title: '힉스필드 첫 만남 · 회원가입과 Free 10크레딧',  short: '힉스필드 첫 만남',          act: 'ACT 1 · 입문',           bg: 'FLOW' },
  { nn: '02', folder: '02강_영어_메뉴_풀이사전',          title: '영어 메뉴 풀이사전 · 글로벌 네비 15개',        short: '영어 메뉴 풀이사전',        act: 'ACT 1 · 입문',           bg: 'NETWORK' },
  { nn: '03', folder: '03강_크레딧_가계부',               title: '크레딧 가계부 · Free vs Plus 의사결정',        short: '크레딧 가계부',             act: 'ACT 1 · 입문',           bg: 'WAVES' },
  { nn: '04', folder: '04강_Soul_2_인물_사진',            title: 'Soul 2.0 · 60+ 프리셋 첫 인물 사진',           short: 'Soul 2.0 인물 사진',        act: 'ACT 2 · 이미지',         bg: 'CONSTELLATION' },
  { nn: '05', folder: '05강_Soul_ID_일관_캐릭터',         title: 'Soul ID · 내 사진 학습으로 일관 캐릭터',       short: 'Soul ID 일관 캐릭터',       act: 'ACT 2 · 이미지',         bg: 'VORONOI' },
  { nn: '06', folder: '06강_Soul_Reference_시리즈',       title: 'Soul Reference · 사진 한 장으로 시리즈',       short: 'Soul Reference 시리즈',     act: 'ACT 2 · 이미지',         bg: 'FLOW' },
  { nn: '07', folder: '07강_Nano_Banana_Pro_4K',          title: 'Nano Banana Pro · 4K 음식 사진',               short: 'Nano Banana Pro 4K',        act: 'ACT 2 · 이미지',         bg: 'NETWORK' },
  { nn: '08', folder: '08강_GPT_Image_2_포스터',          title: 'GPT Image 2 · 글자 들어간 포스터',             short: 'GPT Image 2 포스터',        act: 'ACT 2 · 이미지',         bg: 'WAVES' },
  { nn: '09', folder: '09강_Kling_인스타_릴스',           title: 'Kling 3.0 · 인스타 릴스 9:16 첫 영상',         short: 'Kling 인스타 릴스',         act: 'ACT 3 · 영상',           bg: 'CONSTELLATION' },
  { nn: '10', folder: '10강_Seedance_틱톡_립싱크',        title: 'Seedance 2.0 · 틱톡 토킹헤드 립싱크',          short: 'Seedance 틱톡 립싱크',      act: 'ACT 3 · 영상',           bg: 'VORONOI' },
  { nn: '11', folder: '11강_Sora_2_유튜브_쇼츠',          title: 'Sora 2 · 유튜브 쇼츠 시네마틱 60초',           short: 'Sora 유튜브 쇼츠',          act: 'ACT 3 · 영상',           bg: 'FLOW' },
  { nn: '12', folder: '12강_Veo_페북_광고',               title: 'Veo 3.1 · 페북 광고 영상 6초',                 short: 'Veo 페북 광고',             act: 'ACT 3 · 영상',           bg: 'NETWORK' },
  { nn: '13', folder: '13강_Cinema_Studio_시네마틱',      title: 'Cinema Studio 3.5 · 광고용 시네마틱',          short: 'Cinema Studio 시네마틱',    act: 'ACT 3 · 영상',           bg: 'WAVES' },
  { nn: '14', folder: '14강_Marketing_Studio_제품광고',   title: 'Marketing Studio · 제품 URL → 30초 광고',      short: 'Marketing Studio 제품광고', act: 'ACT 4 · 마케팅',         bg: 'CONSTELLATION' },
  { nn: '15', folder: '15강_Marketing_Studio_UGC_Hermes', title: 'Marketing Studio UGC · Hermes Agent 트렌드',   short: 'Marketing Studio UGC',      act: 'ACT 4 · 마케팅',         bg: 'VORONOI' },
  { nn: '16', folder: '16강_Pro_Virtual_Try_On',          title: 'Pro Virtual Try-On · 가상 모델 입히기',        short: 'Pro Virtual Try-On',        act: 'ACT 4 · 마케팅',         bg: 'FLOW' },
  { nn: '17', folder: '17강_TV_Spot_페북_시네마틱',       title: 'TV Spot 모드 · 페북 광고 시네마틱',            short: 'TV Spot 페북',              act: 'ACT 4 · 마케팅',         bg: 'NETWORK' },
  { nn: '18', folder: '18강_100Apps_효과_쇼츠',           title: '100+ Apps · 얼굴 교체·트랜지션·효과',          short: '100+ Apps 효과',            act: 'ACT 5 · 실전',           bg: 'WAVES' },
  { nn: '19', folder: '19강_한주_콘텐츠_캘린더',          title: '한 주 콘텐츠 캘린더 · 월~일 7편 한 번에',      short: '한 주 콘텐츠 캘린더',       act: 'ACT 5 · 실전',           bg: 'CONSTELLATION' },
  { nn: '20', folder: '20강_종합_채널_매칭',              title: '결과물 채널 매칭 종합 + 다음 단계',            short: '종합 채널 매칭',            act: 'ACT 5 · 실전',           bg: 'VORONOI' },
];

// 마커 → 다이어그램 type 매핑
const MARKER_TO_DIAGRAM = {
  '[META]': 'meta',
  '[OVERVIEW]': 'overview',
  '[HOOK]': 'hook',
  '[CONCEPT]': 'concept',
  '[BONUS]': 'concept',
  '[RECAP]': 'recap',
  '[BRIDGE]': 'bridge',
};

const TYPE_LABELS = {
  meta: 'META · 파트 메타',
  overview: 'OVERVIEW · 한눈 요약',
  hook: 'HOOK · 오프닝 훅',
  concept: 'CONCEPT · 개념',
  recap: 'RECAP · 복습',
  bridge: 'BRIDGE · 다음 악장',
};

// script_parts/part-NN.md 파싱 → 섹션 배열 (DEMO 제외)
function parseScript(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const markerMatch = trimmed.match(/^\[([A-Z]+)\]/);
    if (markerMatch) {
      const marker = `[${markerMatch[1]}]`;
      if (marker === '[DEMO]') {
        // DEMO 제외 (튜토리얼로)
        if (current) sections.push(current);
        current = null;
        continue;
      }
      const diagram = MARKER_TO_DIAGRAM[marker];
      if (!diagram) {
        if (current) current.body.push(line);
        continue;
      }
      if (current) sections.push(current);
      current = { marker, diagram, title: trimmed.replace(/^\[[A-Z]+\]\s*/, '').trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  // 빈 섹션 제거
  return sections.filter(s => s.body.join('').trim().length > 0);
}

// 본문에서 첫 N문장 추출 (불릿 텍스트용)
function extractBullets(body, count = 3) {
  const text = body.join(' ').replace(/\s+/g, ' ').trim();
  // 메타 마커 제거
  const cleaned = text
    .replace(/\[📺[^\]]*\]/g, '')
    .replace(/\[📊[^\]]*\]/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();
  // 문장 분할
  const sentences = cleaned.split(/(?<=[.?!])\s+/).filter(s => s.length > 5 && s.length < 200);
  return sentences.slice(0, count);
}

// 섹션 → bullet 3개 자동 생성 (이모지 + 키워드 + 핵심)
function makeBullets(section, sessionShort) {
  const sentences = extractBullets(section.body, 6);
  const emojis = {
    meta: ['🎬', '🎯', '⏱️'],
    overview: ['📋', '🎤', '🚀'],
    hook: ['💡', '⚡', '🌿'],
    concept: ['🧩', '🔑', '✨'],
    recap: ['✅', '📌', '💾'],
    bridge: ['🚪', '🔜', '🎁'],
  };
  const keywords = {
    meta: ['파트 메타', '핵심 비유', '오늘의 목표'],
    overview: ['수업 흐름', '핵심 비유', '결과물 목표'],
    hook: ['솔직히', '오늘의 시도', '부담 제로'],
    concept: ['핵심 개념', '메뉴 이해', '왜 중요한가'],
    recap: ['오늘 배운 것', '체크포인트', '저장 포인트'],
    bridge: ['다음 회차 예고', '연결 고리', '미리 준비'],
  };
  const e = emojis[section.diagram] || ['📌', '🎯', '💡'];
  const k = keywords[section.diagram] || ['핵심 1', '핵심 2', '핵심 3'];

  const bullets = [];
  for (let i = 0; i < 3; i++) {
    const sentence = sentences[i] || sentences[0] || `${sessionShort} 핵심 포인트`;
    const text = `${e[i]} ${k[i]} · ${sentence.substring(0, 30).replace(/[「」"]/g, '')}`;
    const detail = sentence.substring(0, 200);
    bullets.push({ num: String(i + 1).padStart(2, '0'), text, detail });
  }
  return bullets;
}

// 회차별 단순 SVG (배경 모드별 변형)
function makeSvg(section, idx, total) {
  const colors = ['#e2c793', '#F7F0DF', '#7a7666', '#3a3730'];
  const num = idx + 1;
  return `<svg viewBox="0 0 400 260" class="infographic">
  <defs>
    <radialGradient id="g${idx}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e2c793" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#e2c793" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="130" r="80" fill="url(#g${idx})" stroke="#3a3730" stroke-width="1"/>
  <circle cx="200" cy="130" r="50" fill="none" stroke="#e2c793" stroke-width="1.5"/>
  <text x="200" y="138" text-anchor="middle" font-size="28" font-weight="900" fill="#e2c793">${num}/${total}</text>
  <text x="200" y="220" text-anchor="middle" font-size="11" fill="#7a7666">${section.diagram.toUpperCase()} · ${section.title.substring(0, 40)}</text>
  <line x1="60" y1="240" x2="340" y2="240" stroke="#3a3730" stroke-width="1"/>
</svg>`;
}

// 슬라이드 HTML 생성
function makeCoverSlide(session) {
  return `    <section class="slide slide-cover" data-slide="0" data-duration="60">
      <div class="cover-bg-shapes">
        <svg class="float-shape fs1" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="none" stroke="#e2c793" stroke-width="1"/></svg>
        <svg class="float-shape fs2" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#e2c793" stroke-width="1"/></svg>
        <svg class="float-shape fs3" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="#e2c793" stroke-width="1" transform="rotate(15 50 50)"/></svg>
        <svg class="float-shape fs4" viewBox="0 0 100 100"><polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="#e2c793" stroke-width="1"/></svg>
      </div>
      <div class="cover-kicker reveal">${session.act}</div>
      <div class="cover-number reveal" style="transition-delay:0.1s">PART ${session.nn}</div>
      <h1 class="cover-title typewriter-target" data-text="${session.short}">&nbsp;</h1>
      <div class="cover-sub reveal" style="transition-delay:0.6s">${session.title}</div>
      <div class="cover-meta reveal" style="transition-delay:0.8s">
        <span class="meta-dot"></span>
        <span>인터랙티브 슬라이드 · 마우스·키보드로 조작</span>
      </div>
      <div class="cover-hint reveal" style="transition-delay:1s">⌨ <kbd>←</kbd><kbd>→</kbd> 슬라이드 · <kbd>Space</kbd>/<kbd>Backspace</kbd> 문장 다음/이전 · <kbd>F</kbd> 전체화면 · <kbd>N</kbd> 노트</div>
    </section>`;
}

function makeSectionSlide(section, idx, total, slideIdx) {
  const bullets = makeBullets(section, section.title);
  const counter = section.diagram === 'overview' ? '00 / 00' : `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const svg = makeSvg(section, idx, total);
  const bulletsHtml = bullets.map((b, i) =>
    `<li class="tilt-card reveal" style="transition-delay:${(i * 0.12).toFixed(2)}s" onclick="event.stopPropagation();"><span class="bullet-num">${b.num}</span><span class="bullet-text">${escapeHtml(b.text)}</span><span class="bullet-arrow">→</span><div class="bullet-detail">${escapeHtml(b.detail)}</div></li>`
  ).join('');
  return `    <section class="slide slide-section" data-slide="${slideIdx}" data-diagram="${section.diagram}" data-duration="120">
      <div class="section-head">
        <div class="section-kicker reveal">${TYPE_LABELS[section.diagram] || section.diagram.toUpperCase()}</div>
        <div class="section-counter reveal">${counter}</div>
      </div>
      <div class="section-grid">
        <h2 class="section-title">${escapeHtml(section.title.substring(0, 30))}</h2>
        <div class="section-visual reveal" style="transition-delay:0.3s">${svg}</div>
        <ul class="bullet-list">${bulletsHtml}</ul>
      </div>
      <div class="section-foot">
        <div class="audio-bars"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="foot-tag">${section.diagram.toUpperCase()}</div>
      </div>
    </section>`;
}

function makeOutroSlide(session, slideIdx) {
  const next = SESSIONS.find(s => parseInt(s.nn) === parseInt(session.nn) + 1);
  const nextHint = next ? next.short : '코스 마무리';
  return `    <section class="slide slide-outro" data-slide="${slideIdx}">
      <div class="outro-radial"></div>
      <div class="outro-kicker reveal">END OF PART ${session.nn}</div>
      <h2 class="outro-title reveal" style="transition-delay:0.15s">${escapeHtml(session.short)} 마무리</h2>
      <div class="outro-sub reveal" style="transition-delay:0.3s">${next ? `NEXT · Part ${next.nn} · ${next.short}` : '🎉 풀코스 완주를 축하합니다'}</div>
      <div class="outro-actions reveal" style="transition-delay:0.5s">
        <a class="btn btn-ghost" href="../index.html">← 전체 목차</a>
        <button class="btn btn-gold" onclick="goFirst()">처음으로 ↺</button>
        ${next ? `<a class="btn btn-gold" href="../../${next.folder}/PPT/part-${next.nn}.html">다음으로 →</a>` : ''}
      </div>
    </section>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function makeTopbar(session) {
  const prev = SESSIONS.find(s => parseInt(s.nn) === parseInt(session.nn) - 1);
  const next = SESSIONS.find(s => parseInt(s.nn) === parseInt(session.nn) + 1);
  const prevLink = prev
    ? `<a class="nav-arrow" href="../../${prev.folder}/PPT/part-${prev.nn}.html" title="이전 회차">◀ PART ${prev.nn}</a>`
    : `<a class="nav-arrow disabled" title="이전 없음">◀ FIRST</a>`;
  const nextLink = next
    ? `<a class="nav-arrow" href="../../${next.folder}/PPT/part-${next.nn}.html" title="다음 회차">PART ${next.nn} ▶</a>`
    : `<a class="nav-arrow disabled" title="마지막">END ▶</a>`;
  return `<div class="topbar">
  <div class="brand">HIGGSFIELD · 풀코스</div>
  <div class="topbar-center">PART ${session.nn} · ${escapeHtml(session.short)}</div>
  <div class="topbar-right">
    <button id="projectorBtn" type="button" onclick="window.openProjectorWindow()" style="display:none;" title="프로젝터용 수강생 창 새로 열기">📺 프로젝터</button>
    ${prevLink}
    <a class="nav-arrow" href="../../index.html">INDEX</a>
    ${nextLink}
  </div>
</div>`;
}

function buildHtml(session, sections) {
  const slides = [makeCoverSlide(session)];
  let slideIdx = 1;
  const totalSections = sections.length;
  sections.forEach((sec, i) => {
    slides.push(makeSectionSlide(sec, i + 1, totalSections, slideIdx));
    slideIdx++;
  });
  slides.push(makeOutroSlide(session, slideIdx));

  const thumbItems = [
    `<div class="thumb" data-idx="0"><span class="thumb-num">01</span><span class="thumb-label">COVER</span></div>`,
    ...sections.map((sec, i) => `<div class="thumb" data-idx="${i + 1}"><span class="thumb-num">${String(i + 2).padStart(2, '0')}</span><span class="thumb-label">${sec.diagram.toUpperCase()}</span></div>`),
    `<div class="thumb" data-idx="${slideIdx}"><span class="thumb-num">${String(slideIdx + 1).padStart(2, '0')}</span><span class="thumb-label">END</span></div>`,
  ].join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Part ${session.nn} · ${escapeHtml(session.short)} — 힉스필드 풀코스</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<link rel="stylesheet" href="../../assets/common.css">
</head>
<body class="teacher-view" data-bg-mode="${session.bg}">

<canvas id="bgcanvas"></canvas>
<div class="dot-grid"></div>
<div class="vignette"></div>
<div class="cursor-dot" id="cursorDot"></div>
<div class="cursor-ring" id="cursorRing"></div>

${makeTopbar(session)}

<div class="progress" id="progress"></div>

<main class="deck" id="deck">
${slides.join('\n')}
</main>

<div class="controls">
  <button class="ctl-btn" onclick="prev()" title="이전 슬라이드">◀</button>
  <div class="counter"><span id="counter">01</span> / <span id="total">${slideIdx + 1}</span></div>
  <button class="ctl-btn" onclick="next()" title="다음 슬라이드">▶</button>
  <button class="ctl-btn" onclick="toggleThumbs()" title="썸네일 (T)">🎴</button>
  <button class="ctl-btn" onclick="toggleHelp()" title="도움말 (?)">?</button>
  <button class="ctl-btn" onclick="toggleFullscreen()" title="전체화면 (F)">⛶</button>
</div>

<div class="thumb-strip" id="thumbStrip">
  <div class="thumb-strip-inner" id="thumbInner">
    ${thumbItems}
  </div>
</div>

<div class="help-overlay" id="helpOverlay">
  <div class="help-card">
    <h3>키보드 단축키</h3>
    <ul>
      <li><kbd>←</kbd> / <kbd>→</kbd> 슬라이드 이동</li>
      <li><kbd>Space</kbd> / <kbd>Backspace</kbd> 문장 다음/이전</li>
      <li><kbd>F</kbd> 전체화면</li>
      <li><kbd>T</kbd> 썸네일</li>
      <li><kbd>N</kbd> 강사 노트 토글</li>
      <li><kbd>?</kbd> 도움말</li>
    </ul>
    <button onclick="toggleHelp()">닫기</button>
  </div>
</div>

<footer class="page-footer">© PajamaBoss · 힉스필드 풀코스 · ${session.act}</footer>

<script src="../../assets/common.js"></script>
</body>
</html>`;
}

// ============ MAIN ============
function main() {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : SESSIONS.map(s => s.nn);

  const results = [];
  for (const session of SESSIONS) {
    if (!targets.includes(session.nn)) continue;
    const scriptPath = path.join(SCRIPT_DIR, `part-${session.nn}.md`);
    if (!fs.existsSync(scriptPath)) {
      results.push({ nn: session.nn, status: 'skip-no-script' });
      continue;
    }
    const sections = parseScript(scriptPath);
    if (sections.length === 0) {
      results.push({ nn: session.nn, status: 'skip-no-sections' });
      continue;
    }
    const html = buildHtml(session, sections);
    const outDir = path.join(OUTPUT_DIR, session.folder, 'PPT');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    // 기존 part-01.html 정리 (이전 빌드 잔재)
    const oldPath = path.join(outDir, 'part-01.html');
    if (fs.existsSync(oldPath) && session.nn !== '01') fs.unlinkSync(oldPath);
    const outPath = path.join(outDir, `part-${session.nn}.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    results.push({ nn: session.nn, status: 'ok', sections: sections.length, slides: sections.length + 2, path: outPath });
  }

  console.log('🎬 PPT 생성 결과:');
  for (const r of results) {
    if (r.status === 'ok') {
      console.log(`  ✅ ${r.nn}강 · ${r.sections}섹션 · ${r.slides}슬라이드 → ${path.relative(LECTURE_ROOT, r.path)}`);
    } else {
      console.log(`  ⏭️  ${r.nn}강 · ${r.status}`);
    }
  }
  console.log(`\n총 ${results.filter(r => r.status === 'ok').length}개 PPT 생성`);
}

main();
