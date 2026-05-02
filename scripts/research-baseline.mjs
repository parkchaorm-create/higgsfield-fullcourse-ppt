#!/usr/bin/env node
/**
 * Higgsfield 도구 학습 자동화 (T1·T2·T3 딥리서치)
 *
 * 사용:
 *   node scripts/research-baseline.mjs              # 1차 baseline
 *   node scripts/research-baseline.mjs --diff       # 직전 baseline과 diff (cron용)
 *   node scripts/research-baseline.mjs --mini PART  # 특정 회차 미니 갱신
 *
 * 출력: _design/tool-live-higgsfield-YYYY-MM-DD.md
 *      _design/raw/{T1,T2,T3}-*.json (gitignored)
 *
 * SSOT: starter/.claude/_archive/rules-extended/tool-live-verification.md
 *
 * 정책:
 *  - T1 (공식): 6건+ 절대 우위
 *  - T2 (1주일 이내·조회수 1만+): 3건+
 *  - T3 (교차): 2건+
 *  - 현재 시점 기준 (오래된 자료 명시)
 *  - LLM 호출 최소화 · WebFetch + WebSearch + Higgsfield MCP 호출만
 *
 * 구현: TODO (P1 단계에서 채워짐 · 현재는 골격)
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const TODAY = new Date().toISOString().slice(0, 10);
const DESIGN_DIR = path.resolve(import.meta.dirname, '..', '_design');
const RAW_DIR = path.join(DESIGN_DIR, 'raw');
const OUTPUT = path.join(DESIGN_DIR, `tool-live-higgsfield-${TODAY}.md`);

const T1_URLS = [
  'https://higgsfield.ai/',
  'https://higgsfield.ai/pricing',
  'https://higgsfield.ai/models',
  'https://higgsfield.ai/blog',
  // docs·changelog·youtube 채널은 P1 실행 시 동적 발견
];

const T2_QUERIES = [
  'higgsfield AI tutorial 2026',
  'higgsfield video generation review',
  '힉스필드 AI 영상 만들기',
  'higgsfield reels marketing',
  'site:reddit.com higgsfield',
];

const T3_QUERIES = [
  'higgsfield vs Sora vs Kling vs Runway',
  'higgsfield review futurepedia OR aitools.fyi',
];

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  console.log(`📚 Research baseline (${TODAY})`);
  console.log('  T1 URLs:', T1_URLS.length);
  console.log('  T2 queries:', T2_QUERIES.length);
  console.log('  T3 queries:', T3_QUERIES.length);
  console.log('\n⚠️  골격만 작성됨. 실제 WebFetch+MCP 호출은 P1 단계에서 메인 LLM이 진행.');
  console.log(`   결과물 박제 위치: ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
