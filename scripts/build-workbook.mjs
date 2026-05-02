#!/usr/bin/env node
/**
 * build-workbook.mjs · 전체 복붙용 워크북 자동 생성
 *
 * 입력: input/script/script_parts/part-NN.md (20개)
 * 출력: output/_workbook.md (학생이 회차 진행하며 한 곳에서 복사 가능한 통합 워크북)
 *
 * 추출:
 *  - [DEMO] 섹션의 ```paste / ```prompt / ```bash / ```text 코드블록
 *  - "물어봅시다 / 입력해보세요" 등 키워드 다음 큰따옴표 안 30자+ 텍스트 (build-tutorials와 동일 휴리스틱)
 *  - URL (https?://)
 *
 * 토큰 절약: LLM 호출 0 · Node + regex만
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LECTURE_ROOT = path.resolve(__dirname, '..');
const SCRIPT_DIR = path.join(LECTURE_ROOT, 'input/script/script_parts');
const OUTPUT_PATH = path.join(LECTURE_ROOT, 'output/_workbook.md');

// 회차 메타 (build-ppt.mjs와 동일)
const SESSIONS = [
  { nn: '01', folder: '01강_힉스필드_첫_만남',           short: '힉스필드 첫 만남',          act: 'ACT 1 · 입문' },
  { nn: '02', folder: '02강_영어_메뉴_풀이사전',          short: '영어 메뉴 풀이사전',        act: 'ACT 1 · 입문' },
  { nn: '03', folder: '03강_크레딧_가계부',               short: '크레딧 가계부',             act: 'ACT 1 · 입문' },
  { nn: '04', folder: '04강_Soul_2_인물_사진',            short: 'Soul 2.0 인물 사진',        act: 'ACT 2 · 이미지' },
  { nn: '05', folder: '05강_Soul_ID_일관_캐릭터',         short: 'Soul ID 일관 캐릭터',       act: 'ACT 2 · 이미지' },
  { nn: '06', folder: '06강_Soul_Reference_시리즈',       short: 'Soul Reference 시리즈',     act: 'ACT 2 · 이미지' },
  { nn: '07', folder: '07강_Nano_Banana_Pro_4K',          short: 'Nano Banana Pro 4K',        act: 'ACT 2 · 이미지' },
  { nn: '08', folder: '08강_GPT_Image_2_포스터',          short: 'GPT Image 2 포스터',        act: 'ACT 2 · 이미지' },
  { nn: '09', folder: '09강_Kling_인스타_릴스',           short: 'Kling 인스타 릴스',         act: 'ACT 3 · 영상' },
  { nn: '10', folder: '10강_Seedance_틱톡_립싱크',        short: 'Seedance 틱톡 립싱크',      act: 'ACT 3 · 영상' },
  { nn: '11', folder: '11강_Sora_2_유튜브_쇼츠',          short: 'Sora 2 유튜브 쇼츠',        act: 'ACT 3 · 영상' },
  { nn: '12', folder: '12강_Veo_페북_광고',               short: 'Veo 페북 광고',             act: 'ACT 3 · 영상' },
  { nn: '13', folder: '13강_Cinema_Studio_시네마틱',      short: 'Cinema Studio 시네마틱',    act: 'ACT 3 · 영상' },
  { nn: '14', folder: '14강_Marketing_Studio_제품광고',   short: 'Marketing Studio 제품광고', act: 'ACT 4 · 마케팅' },
  { nn: '15', folder: '15강_Marketing_Studio_UGC_Hermes', short: 'Marketing Studio UGC Hermes', act: 'ACT 4 · 마케팅' },
  { nn: '16', folder: '16강_Pro_Virtual_Try_On',          short: 'Pro Virtual Try-On',        act: 'ACT 4 · 마케팅' },
  { nn: '17', folder: '17강_TV_Spot_페북_시네마틱',       short: 'TV Spot 페북 시네마틱',     act: 'ACT 4 · 마케팅' },
  { nn: '18', folder: '18강_100Apps_효과_쇼츠',           short: '100+ Apps 효과 쇼츠',       act: 'ACT 5 · 실전' },
  { nn: '19', folder: '19강_한주_콘텐츠_캘린더',          short: '한 주 콘텐츠 캘린더',       act: 'ACT 5 · 실전' },
  { nn: '20', folder: '20강_종합_채널_매칭',              short: '종합 채널 매칭',            act: 'ACT 5 · 실전' },
];

const PROMPT_KEYWORDS = [
  '물어봅시다', '물어보세요', '물어볼까',
  '이렇게요', '이렇게 ', '다음과 같이', '이런 식으로',
  '복사해', '복붙', '입력해', '입력하', '넣어', '붙여',
  '프롬프트', '아래', '다음을 ',
  '써보세요', '쳐보세요', '보내세요', '올려주세요',
  '이 문장', '이거 ',
];

// [DEMO] 섹션만 추출
function extractDemoSections(scriptText) {
  const lines = scriptText.split('\n');
  const demos = [];
  let inDemo = false;
  let buffer = [];
  let demoTitle = '';

  for (const line of lines) {
    if (/^\[DEMO\]/.test(line.trim())) {
      if (inDemo && buffer.length > 0) demos.push({ title: demoTitle, body: buffer.join('\n') });
      inDemo = true;
      buffer = [];
      demoTitle = line.replace(/^\[DEMO\]\s*/, '').trim() || '실습';
    } else if (/^\[[A-Z]+\]/.test(line.trim()) && inDemo) {
      if (buffer.length > 0) demos.push({ title: demoTitle, body: buffer.join('\n') });
      inDemo = false;
      buffer = [];
    } else if (inDemo) {
      buffer.push(line);
    }
  }
  if (inDemo && buffer.length > 0) demos.push({ title: demoTitle, body: buffer.join('\n') });
  return demos;
}

// 코드블록 (```lang ... ```) 추출
function extractCodeBlocks(text) {
  const blocks = [];
  const re = /```(\w*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const lang = m[1] || 'text';
    const content = m[2].trim();
    if (content.length === 0) continue;
    blocks.push({ lang, content });
  }
  return blocks;
}

// 큰따옴표 안 텍스트 (prompt 키워드 직전 80자 안일 때)
function extractQuotedPrompts(text) {
  // 코드블록 안의 따옴표는 제외 (먼저 코드블록 영역 마스킹)
  const fenceMask = text.replace(/```[\s\S]*?```/g, m => ' '.repeat(m.length));
  const prompts = [];
  // 30자 이상, 600자 이하만 (너무 긴 것은 다른 텍스트가 잡힌 것)
  const quoteRe = /[""]([^""]{30,600})[""]|"([^"]{30,600})"/g;
  let m;
  while ((m = quoteRe.exec(fenceMask)) !== null) {
    const content = (m[1] || m[2] || '').trim();
    if (!content) continue;
    // 줄바꿈이 너무 많으면 (4줄+) 잘못 잡힌 것 (마크다운 본문 일부 포함)
    if ((content.match(/\n/g) || []).length > 3) continue;
    // 마크다운 강조 (**) 포함이면 본문 텍스트 (prompt 아님)
    if (content.includes('**') || content.includes('##')) continue;
    const before = fenceMask.substring(Math.max(0, m.index - 80), m.index);
    const hasKeyword = PROMPT_KEYWORDS.some(kw => before.includes(kw));
    if (!hasKeyword) continue;
    prompts.push(content);
  }
  return prompts;
}

// URL 추출 (코드블록 밖)
function extractUrls(text) {
  const fenceMask = text.replace(/```[\s\S]*?```/g, m => ' '.repeat(m.length));
  const urls = [...new Set(fenceMask.match(/https?:\/\/[^\s)\]]+/g) || [])];
  return urls;
}

function buildWorkbook() {
  const today = new Date().toISOString().slice(0, 10);
  let md = `# 📋 힉스필드 풀코스 · 전체 복붙 워크북\n\n`;
  md += `> 학생이 20회차 진행하며 **한 곳에서 모든 프롬프트·명령어·URL을 복사**할 수 있는 통합 워크북.\n`;
  md += `> 자동 생성 (수정 시 다음 빌드에서 덮어써짐). 마지막 갱신: ${today}\n\n`;
  md += `## 📚 회차 빠른 이동\n\n`;
  for (const s of SESSIONS) {
    md += `- ${s.nn}강 · ${s.short} (${s.act})\n`;
  }
  md += `\n> 위 회차 제목으로 노션 페이지 내 검색(Ctrl+F·Cmd+F)하세요.\n\n---\n\n`;

  let totalPrompts = 0;
  let totalUrls = 0;

  for (const session of SESSIONS) {
    const scriptPath = path.join(SCRIPT_DIR, `part-${session.nn}.md`);
    if (!fs.existsSync(scriptPath)) continue;
    const text = fs.readFileSync(scriptPath, 'utf-8');
    const demos = extractDemoSections(text);

    const baseUrl = 'https://parkchaorm-create.github.io/higgsfield-fullcourse-ppt/output';
    const folderEnc = encodeURI(session.folder);
    md += `## ${session.nn}강 · ${session.short}\n\n`;
    md += `> **${session.act}** · [PPT 강사용](${baseUrl}/${folderEnc}/PPT/part-${session.nn}.html?view=teacher) · [PPT 학생용](${baseUrl}/${folderEnc}/PPT/part-${session.nn}.html?view=student)\n\n`;

    if (demos.length === 0) {
      md += `_이 회차에는 [DEMO] 섹션이 없습니다._\n\n---\n\n`;
      continue;
    }

    for (let i = 0; i < demos.length; i++) {
      const demo = demos[i];
      md += `### 📍 실습 ${i + 1} · ${demo.title}\n\n`;

      // 1. 코드블록 (paste·prompt·bash·text)
      const blocks = extractCodeBlocks(demo.body);
      const promptBlocks = blocks.filter(b => /paste|prompt|text/i.test(b.lang));
      const cmdBlocks = blocks.filter(b => /bash|sh|powershell|cmd|js|python/i.test(b.lang));

      if (promptBlocks.length > 0) {
        md += `#### 💬 복붙 프롬프트\n\n`;
        for (const b of promptBlocks) {
          md += '```text\n' + b.content + '\n```\n\n';
          totalPrompts++;
        }
      }

      if (cmdBlocks.length > 0) {
        md += `#### ⌨️ 명령어\n\n`;
        for (const b of cmdBlocks) {
          md += '```' + b.lang + '\n' + b.content + '\n```\n\n';
        }
      }

      // 2. 인용 따옴표 안 prompt (코드블록 밖)
      const quotedPrompts = extractQuotedPrompts(demo.body);
      if (quotedPrompts.length > 0) {
        md += `#### 🤖 AI 입력 프롬프트 (자동 추출)\n\n`;
        for (const p of quotedPrompts) {
          md += '```text\n' + p + '\n```\n\n';
          totalPrompts++;
        }
      }

      // 3. URL
      const urls = extractUrls(demo.body);
      if (urls.length > 0) {
        md += `#### 🔗 사용할 URL\n\n`;
        for (const u of urls) {
          md += `- ${u}\n`;
          totalUrls++;
        }
        md += '\n';
      }
    }
    md += `---\n\n`;
  }

  md += `\n## 📊 워크북 통계\n\n`;
  md += `- 회차: ${SESSIONS.length}\n`;
  md += `- 추출된 프롬프트·복붙 블록: ${totalPrompts}\n`;
  md += `- 추출된 URL: ${totalUrls}\n`;
  md += `- 자동 생성: ${today}\n\n`;
  md += `© PajamaBoss · 힉스필드 풀코스\n`;

  return { md, totalPrompts, totalUrls };
}

const result = buildWorkbook();
fs.writeFileSync(OUTPUT_PATH, result.md, 'utf-8');
const lines = result.md.split('\n').length;
console.log(`✅ output/_workbook.md 생성 (${lines}줄 · 프롬프트 ${result.totalPrompts}개 · URL ${result.totalUrls}개)`);
