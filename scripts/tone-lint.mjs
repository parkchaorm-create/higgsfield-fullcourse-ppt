#!/usr/bin/env node
/**
 * 왕왕초보 톤 검증 (회차별 대본·튜토리얼 자동 점검)
 *
 * 사용:
 *   node scripts/tone-lint.mjs                     # 전 회차
 *   node scripts/tone-lint.mjs 03                  # 03강만
 *
 * 검증 룰 (audience-tone-checklist.md SSOT 기반):
 *  R1. 영어 메뉴명 한글 풀이 누락 (예: "Generate" → "Generate(생성)")
 *  R2. 한 단계 한 동작 위반 ("그리고 또 ~" "그 다음에 ~" 묶음)
 *  R3. 비유 등장 회차당 3개+ ("~처럼" "~같은" "마치 ~")
 *  R4. 추측 어휘 ("아마도" "보통" "일반적으로")
 *  R5. 결과 약속 ("반드시" "100%" "보장")
 *  R6. 연령·성별 호명 ("40대 여성분들도")
 *  R7. 야간 발송 ("21시 이후" "밤에 보내")
 *
 * 위반 시: _skill-state/tone-violations-NN.json 생성 (writer agent 재호출용)
 *
 * 구현: TODO (P3 단계에서 룰 + regex 박제 후 동작)
 */

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SCRIPT_PARTS = path.join(ROOT, 'input', 'script', 'script_parts');
const STATE_DIR = path.join(ROOT, '_skill-state');

const RULES = [
  { id: 'R1', name: '영어 메뉴 한글 풀이 누락', pattern: /\b[A-Z][a-z]+\b(?!\s*\()/g, severity: 'high' },
  { id: 'R2', name: '한 단계 한 동작 위반', pattern: /(그리고\s*또|그\s*다음에)/g, severity: 'medium' },
  { id: 'R3', name: '비유 등장 부족', minPerPart: 3, pattern: /(처럼|같은|마치)/g, severity: 'low' },
  { id: 'R4', name: '추측 어휘', pattern: /(아마도|보통은|일반적으로)/g, severity: 'high' },
  { id: 'R5', name: '결과 약속', pattern: /(반드시\s*됩니다|100%|보장합니다)/g, severity: 'critical' },
  { id: 'R6', name: '연령·성별 호명', pattern: /(\d+대\s*(여성|남성)분?들?도)/g, severity: 'critical' },
  { id: 'R7', name: '야간 발송 안내', pattern: /(21시\s*이후|밤에?\s*보내)/g, severity: 'high' },
];

async function main() {
  const arg = process.argv[2];
  console.log(`🔍 Tone lint ${arg ? `(part-${arg})` : '(all)'}`);
  console.log('  적용 룰:', RULES.length);
  console.log('  대상 폴더:', SCRIPT_PARTS);
  console.log('\n⚠️  골격만 작성됨. 실제 검증은 P4 회차 생성 직후 자동 호출.');
}

main().catch(e => { console.error(e); process.exit(1); });
