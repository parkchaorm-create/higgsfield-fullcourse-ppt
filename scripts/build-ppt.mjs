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

// 회차별 SVG · 섹션 타입별 5종 차별화 (META=동심원·HOOK=비교·CONCEPT=플로우·RECAP=체크·BRIDGE=화살표)
function makeSvg(section, idx, total, sessionShort = '') {
  const tag = (section.title || '').substring(0, 36).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  switch (section.diagram) {
    case 'meta':
    case 'overview':
      return svgMeta(idx, tag, sessionShort);
    case 'hook':
      return svgHook(idx, tag);
    case 'concept':
      return svgConcept(idx, tag);
    case 'recap':
      return svgRecap(idx, tag);
    case 'bridge':
      return svgBridge(idx, tag);
    default:
      return svgConcept(idx, tag);
  }
}

// META · 동심원 + 4코너 메타박스 (시간·도구·목표·결과)
function svgMeta(idx, tag, sessionShort) {
  return `<svg viewBox="0 0 400 260" class="infographic">
  <defs>
    <radialGradient id="m${idx}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e2c793" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#e2c793" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="130" r="70" fill="url(#m${idx})" stroke="#e2c793" stroke-width="1.2"/>
  <circle cx="200" cy="130" r="42" fill="none" stroke="#3a3730" stroke-width="1" stroke-dasharray="2 3"/>
  <text x="200" y="125" text-anchor="middle" font-size="13" font-weight="900" fill="#e2c793">${(sessionShort || '회차').substring(0, 14)}</text>
  <text x="200" y="142" text-anchor="middle" font-size="10" fill="#F7F0DF">META · 30분</text>
  <g font-size="10" fill="#F7F0DF">
    <rect x="20" y="22" width="98" height="32" rx="4" fill="none" stroke="#3a3730"/>
    <text x="30" y="42">⏱️ 시간 · 30분</text>
    <rect x="282" y="22" width="98" height="32" rx="4" fill="none" stroke="#3a3730"/>
    <text x="292" y="42">🎯 목표 · 1결과물</text>
    <rect x="20" y="206" width="98" height="32" rx="4" fill="none" stroke="#3a3730"/>
    <text x="30" y="226">🛠️ 도구 · 힉스필드</text>
    <rect x="282" y="206" width="98" height="32" rx="4" fill="none" stroke="#3a3730"/>
    <text x="292" y="226">📍 ${tag.substring(0, 6)}</text>
  </g>
</svg>`;
}

// HOOK · Before vs After 대비
function svgHook(idx, tag) {
  return `<svg viewBox="0 0 400 260" class="infographic">
  <g transform="translate(80,90)">
    <rect x="-50" y="-40" width="100" height="80" rx="6" fill="none" stroke="#7a7666" stroke-width="1.2"/>
    <text x="0" y="-10" text-anchor="middle" font-size="11" fill="#7a7666">BEFORE</text>
    <text x="0" y="14" text-anchor="middle" font-size="22">😵</text>
    <text x="0" y="35" text-anchor="middle" font-size="9" fill="#7a7666">막막·복잡</text>
  </g>
  <g transform="translate(200,90)">
    <text x="0" y="6" text-anchor="middle" font-size="32" fill="#e2c793" font-weight="900">→</text>
  </g>
  <g transform="translate(320,90)">
    <rect x="-50" y="-40" width="100" height="80" rx="6" fill="#e2c793" fill-opacity="0.08" stroke="#e2c793" stroke-width="1.5"/>
    <text x="0" y="-10" text-anchor="middle" font-size="11" fill="#e2c793">AFTER</text>
    <text x="0" y="14" text-anchor="middle" font-size="22">✨</text>
    <text x="0" y="35" text-anchor="middle" font-size="9" fill="#F7F0DF">한 번에 끝</text>
  </g>
  <line x1="50" y1="180" x2="350" y2="180" stroke="#3a3730" stroke-width="1"/>
  <text x="200" y="210" text-anchor="middle" font-size="12" fill="#e2c793" font-weight="700">${tag}</text>
  <text x="200" y="232" text-anchor="middle" font-size="10" fill="#7a7666">HOOK · 오프닝 훅</text>
</svg>`;
}

// CONCEPT · 3단 플로우
function svgConcept(idx, tag) {
  return `<svg viewBox="0 0 400 260" class="infographic">
  <g font-size="11" fill="#F7F0DF">
    <g transform="translate(75,120)">
      <circle r="32" fill="none" stroke="#e2c793" stroke-width="1.5"/>
      <text y="-4" text-anchor="middle" font-size="16">📥</text>
      <text y="14" text-anchor="middle" font-size="10">입력</text>
    </g>
    <g transform="translate(200,120)">
      <circle r="36" fill="#e2c793" fill-opacity="0.1" stroke="#e2c793" stroke-width="2"/>
      <text y="-2" text-anchor="middle" font-size="18">⚙️</text>
      <text y="16" text-anchor="middle" font-size="10">변환</text>
    </g>
    <g transform="translate(325,120)">
      <circle r="32" fill="none" stroke="#e2c793" stroke-width="1.5"/>
      <text y="-4" text-anchor="middle" font-size="16">📤</text>
      <text y="14" text-anchor="middle" font-size="10">결과</text>
    </g>
  </g>
  <path d="M107 120 L164 120 M236 120 L293 120" stroke="#e2c793" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="200" y="60" text-anchor="middle" font-size="13" fill="#e2c793" font-weight="700">${tag}</text>
  <text x="200" y="200" text-anchor="middle" font-size="10" fill="#7a7666">CONCEPT · 3단계 흐름</text>
  <line x1="50" y1="220" x2="350" y2="220" stroke="#3a3730" stroke-width="1"/>
</svg>`;
}

// RECAP · 체크리스트 4개
function svgRecap(idx, tag) {
  return `<svg viewBox="0 0 400 260" class="infographic">
  <g font-size="11" fill="#F7F0DF">
    <g transform="translate(60,60)">
      <circle r="14" fill="#e2c793" fill-opacity="0.15" stroke="#e2c793" stroke-width="1.5"/>
      <text y="5" text-anchor="middle" font-size="14" fill="#e2c793">✓</text>
    </g>
    <text x="84" y="65" font-size="11">핵심 1 · 도구 이해</text>
    <g transform="translate(60,110)">
      <circle r="14" fill="#e2c793" fill-opacity="0.15" stroke="#e2c793" stroke-width="1.5"/>
      <text y="5" text-anchor="middle" font-size="14" fill="#e2c793">✓</text>
    </g>
    <text x="84" y="115" font-size="11">핵심 2 · 메뉴 위치</text>
    <g transform="translate(60,160)">
      <circle r="14" fill="#e2c793" fill-opacity="0.15" stroke="#e2c793" stroke-width="1.5"/>
      <text y="5" text-anchor="middle" font-size="14" fill="#e2c793">✓</text>
    </g>
    <text x="84" y="165" font-size="11">핵심 3 · 첫 결과물</text>
    <g transform="translate(60,210)">
      <circle r="14" fill="none" stroke="#7a7666" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text y="5" text-anchor="middle" font-size="11" fill="#7a7666">→</text>
    </g>
    <text x="84" y="215" font-size="11" fill="#7a7666">다음 회차 · 응용</text>
  </g>
  <text x="200" y="30" text-anchor="middle" font-size="13" fill="#e2c793" font-weight="700">${tag}</text>
  <text x="320" y="30" text-anchor="middle" font-size="10" fill="#7a7666">RECAP</text>
</svg>`;
}

// BRIDGE · 다음 파트로 이어지는 화살표
function svgBridge(idx, tag) {
  return `<svg viewBox="0 0 400 260" class="infographic">
  <g transform="translate(70,130)">
    <rect x="-40" y="-30" width="80" height="60" rx="6" fill="none" stroke="#e2c793" stroke-width="1.5"/>
    <text x="0" y="-8" text-anchor="middle" font-size="10" fill="#e2c793">현재</text>
    <text x="0" y="12" text-anchor="middle" font-size="14">📍</text>
    <text x="0" y="26" text-anchor="middle" font-size="9" fill="#F7F0DF">완주</text>
  </g>
  <path d="M120 130 Q200 90 280 130" stroke="#e2c793" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
  <text x="200" y="80" text-anchor="middle" font-size="11" fill="#e2c793">다음 무대</text>
  <g transform="translate(330,130)">
    <rect x="-40" y="-30" width="80" height="60" rx="6" fill="#e2c793" fill-opacity="0.15" stroke="#e2c793" stroke-width="2"/>
    <text x="0" y="-8" text-anchor="middle" font-size="10" fill="#e2c793">다음</text>
    <text x="0" y="12" text-anchor="middle" font-size="14">🚪</text>
    <text x="0" y="26" text-anchor="middle" font-size="9" fill="#F7F0DF">시작</text>
  </g>
  <text x="200" y="200" text-anchor="middle" font-size="12" fill="#F7F0DF" font-weight="700">${tag}</text>
  <text x="200" y="222" text-anchor="middle" font-size="10" fill="#7a7666">BRIDGE · 다음 악장</text>
  <line x1="50" y1="240" x2="350" y2="240" stroke="#3a3730" stroke-width="1"/>
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

function makeSectionSlide(section, idx, total, slideIdx, sessionShort) {
  const bullets = makeBullets(section, section.title);
  const counter = section.diagram === 'overview' ? '00 / 00' : `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const svg = makeSvg(section, idx, total, sessionShort);
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
    slides.push(makeSectionSlide(sec, i + 1, totalSections, slideIdx, session.short));
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
