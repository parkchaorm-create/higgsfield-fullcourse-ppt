#!/usr/bin/env node
/**
 * 회차별 결과물 갤러리 자동 생성 (Higgsfield MCP)
 *
 * 사용:
 *   node scripts/generate-gallery.mjs              # 전 회차
 *   node scripts/generate-gallery.mjs 03           # 03강만
 *   node scripts/generate-gallery.mjs --estimate   # 크레딧 사용 예측만
 *
 * 정책:
 *  - 회차당 결과물 1~2개 (가상 클라이언트 4종 × 결과물 채널)
 *  - 출력: output/NN강_*/gallery/result-{A|B|C|D}.{mp4|png}
 *  - 메타: output/NN강_*/gallery/manifest.json (모델·프롬프트·생성 시간)
 *  - 크레딧 모니터링: balance < 100 시 중단 + 보고
 *
 * 호출 도구:
 *  - mcp__claude_ai_higgsfield__balance       (사전·사후 잔액)
 *  - mcp__claude_ai_higgsfield__models_explore (사용 가능 모델)
 *  - mcp__claude_ai_higgsfield__generate_video (영상 생성)
 *  - mcp__claude_ai_higgsfield__generate_image (이미지 생성)
 *  - mcp__claude_ai_higgsfield__job_status    (생성 진행)
 *  - mcp__claude_ai_higgsfield__job_display   (결과물 다운로드)
 *
 * 구현: TODO (P5 단계에서 메인 LLM이 MCP 직접 호출)
 *
 * 참고: 본 스크립트는 manifest 작성 + 파일 정리 보조 역할.
 * 실제 MCP 호출은 메인 LLM 컨텍스트에서.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const STATE_PATH = path.join(ROOT, '_skill-state', 'state.json');

const CHANNEL_SPECS = {
  '인스타_릴스': { aspect: '9:16', duration_sec: 15 },
  '틱톡':        { aspect: '9:16', duration_sec: 30 },
  '유튜브_쇼츠': { aspect: '9:16', duration_sec: 60 },
  '페북_광고':   { aspect: '1:1',  duration_sec: 15 },
  '인스타_광고': { aspect: '4:5',  duration_sec: 30 },
};

async function main() {
  const arg = process.argv[2];
  console.log(`🎬 Gallery generation ${arg || '(all)'}`);
  console.log('  채널 사양:', Object.keys(CHANNEL_SPECS).length);
  console.log('  결과물 위치:', OUTPUT_DIR);
  console.log('\n⚠️  골격만 작성됨. 실제 MCP 호출은 P5 단계에서 메인 LLM이 진행.');
}

main().catch(e => { console.error(e); process.exit(1); });
