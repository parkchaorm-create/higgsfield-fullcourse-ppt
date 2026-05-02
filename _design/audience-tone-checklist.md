# Audience Tone Checklist · 힉스필드 풀코스 (왕왕초보 SSOT)

> Phase 0-2 신규 SSOT (1번 강의에는 없는 산출물 · 왕왕초보 강의 전용).
> `lecture.config.json` `audience.tone_principles` 6항을 자동 검증 가능한 lint 룰로 박제.
> **참조 lint 스크립트**: `tone-lint.mjs` (P3 단계에서 작성 · 본 SSOT 절대 우위).

---

## 6항 톤 원칙 → lint 룰 매핑

### 원칙 1 · 비유 우선
> "모든 개념은 일상 비유로 먼저 설명 (오케스트라·요리·택시·운전 등)"

| 룰 ID | 검증 절차 | 자동·수동 |
|:---:|---|:---:|
| TONE-1A | 새 개념 도입 슬라이드(첫 CONCEPT)의 bullet-detail 첫 문장이 비유사전 30개 중 1개 포함 | 수동 (비유사전 grep) |
| TONE-1B | 기술 용어 직설 금지: `transformer`·`multimodal`·`diffusion`·`latent space`·`token`·`embedding` lint 검출 → fail | 자동 (regex) |
| TONE-1C | bullet-detail 첫 문장 "왜?" 없이 "어떻게?"만 → warn (audience.tone_principles 6항 위반) | 자동 (heuristic) |

**lint regex (자동)**:
```regex
TONE-1B: /(transformer|multimodal|diffusion|latent\s+space|embedding|attention\s+mechanism|cross-modal|fine-tuning)/i
```
→ 매칭 시 fail. 단 메뉴풀이사전(`multimodal`은 한글 풀이 동반 시 OK · "멀티모달(여러 형식)") 예외 허용.

### 원칙 2 · 클릭 가이드 (한 단계 한 동작)
> "실습은 '여기 누르세요 → 이 화면 나옴 → 다음 누르세요' 단계별"

| 룰 ID | 검증 절차 | 자동·수동 |
|:---:|---|:---:|
| TONE-2A | 튜토리얼 Step 안에 "그리고", "이어서", "동시에", "또한" 같은 묶음 어미 1회 초과 시 warn | 자동 (regex) |
| TONE-2B | 한 Step에 동작 동사(`누르`·`클릭`·`입력`·`복사`·`드래그`) 2개 초과 시 fail | 자동 (count) |
| TONE-2C | "왜 이 버튼?" 1줄 이유 동반 여부 (Step당) | 수동 (sample 5%) |

**lint regex (자동)**:
```regex
TONE-2A: /\b(그리고|이어서|동시에|또한|아울러)\b/g  → 1 Step 내 카운트 > 1 → warn
TONE-2B: /(?:누르|클릭|입력|복사|드래그|업로드)/g  → 1 Step 내 카운트 > 2 → fail
```

### 원칙 3 · 용어 풀이 (영어 메뉴 첫 등장 시 한글 풀이)
> "모든 영어 메뉴명·전문 용어 첫 등장 시 한글 풀이 괄호 병기"

| 룰 ID | 검증 절차 | 자동·수동 |
|:---:|---|:---:|
| TONE-3A | 슬라이드 단위 첫 등장 영어 메뉴명에 한글 풀이 괄호 동반 (`Marketing Studio(마케팅 스튜디오)` 형식) | 자동 (regex + 메뉴풀이사전 lookup) |
| TONE-3B | SVG 안 영어 단독 노출 (한글 병기 없음) → fail | 자동 (regex) |
| TONE-3C | 메뉴풀이사전 50개에 없는 영어 메뉴 노출 → warn (사전 갱신 트리거) | 자동 (사전 lookup) |
| TONE-3D | 추측 어휘 (`아마`·`보통`·`일반적으로`·`~일 거예요`·`~인 것 같`) → fail | 자동 (regex) |

**lint regex (자동)**:
```regex
TONE-3B: SVG <text> 또는 <tspan> 내용이 /^[A-Z][a-zA-Z\s\d\.]+$/ 만 (한글 0자) → fail
TONE-3D: /(아마|보통|일반적으로|것\s*같|일\s*거예요|일거에요|일것입니다)/g → fail
```

### 원칙 4 · 스크린샷 OK (튜토리얼 한정)
> "GUI 도구라 스크린샷 적극 활용 · 1번 강의 v2 정책 예외"

| 룰 ID | 검증 절차 | 자동·수동 |
|:---:|---|:---:|
| TONE-4A | PPT HTML 안 `<img>` 태그 또는 `screenshot:` 마커 → fail (PPT는 스크린샷 0 유지) | 자동 (grep) |
| TONE-4B | 튜토리얼 마크다운 `![]` 또는 `<img>` → OK (warn 없음) · `screenshot-policy.md` 규약 따름 | 수동 (sample 검토) |
| TONE-4C | 스크린샷 파일명 `<회차>-<step>-<설명>.png` 형식 | 수동 (sample) |

### 원칙 5 · 한 번에 한 동작
> "한 단계에 동작 1개만. '이거 누르고 저거 누르세요' 묶음 금지"

→ TONE-2B와 동일. (튜토리얼만 적용 · PPT bullet은 TONE-5A로 별도)

| 룰 ID | 검증 절차 | 자동·수동 |
|:---:|---|:---:|
| TONE-5A | PPT bullet-text 한 항목 안 동작 동사 1개 초과 → warn | 자동 (count) |

### 원칙 6 · 왜 하는지 설명
> "단계마다 '왜 이 버튼?' 1줄 이유 동반"

→ TONE-1C(bullet)와 TONE-2C(튜토리얼) 통합. 별도 룰 없음.

---

## 추가 lint 룰 (왕왕초보 강의 신규)

### TONE-G1 · 결과 약속 어휘 금지 (1번 강의 R 시리즈 승계)
- 검출: `100%`·`무조건`·`반드시 됩니다`·`보장`·`놓치면 후회` → fail
- 정규식: `/(100\s*%|무조건|반드시\s*됩니다|보장됩니다|놓치면\s*후회)/g`

### TONE-G2 · 연령·성별 호명 금지
- 검출: `40대 여성분들`·`사장님들`·`아저씨`·`아주머니` 본문 노출 → fail
- 페르소나 표(강의기획안.md 2절)는 예외
- 정규식: `/(\d+대\s*[남여여성여자남자])|(사장님들|아저씨들|아주머니들)/g`

### TONE-G3 · 시간 표기 금지 (PPT 본문)
- 검출: PPT bullet-text/detail에 `\d+분`·`\d+시` → fail (튜토리얼 헤더 박스만 예외)
- 정규식: `/\b\d+(분|시간)(\s|·|\.)/g` (PPT 안만 적용)

### TONE-G4 · 야간 발송 안내 금지
- 검출: `21:0[0-9]\s*~`·`익일\s*0[0-9]:00` → fail (정보통신망법)
- 본 강의는 광고성 발송 없음 → 사실상 안 걸림 · 안전망

### TONE-G5 · 자기지칭 자제 (스크립트 외)
- 검출: bullet-detail·SVG에 `저는`·`제가`·`나는` → warn (원본 스크립트 강사 노트는 OK)
- 정규식: `/(\b저는\b|\b제가\b|\b나는\b)/g`

---

## tone-lint.mjs 구현 명세 (P3에서 작성)

```javascript
// .claude/scripts/tone-lint.mjs (예상 구조)
const RULES = [
  { id: 'TONE-1B', regex: /(transformer|multimodal|...)/i, level: 'fail', exceptionLookup: '메뉴풀이사전.md' },
  { id: 'TONE-3B', custom: checkSvgEnglishOnly, level: 'fail' },
  { id: 'TONE-3D', regex: /(아마|보통|...)/g, level: 'fail' },
  // ... 12개 룰
];

// 입력: PPT HTML 또는 튜토리얼 MD 파일 경로
// 출력: { fail: [...], warn: [...], pass: count }
```

호출:
```bash
node .claude/scripts/tone-lint.mjs --lecture-dir "lectures/힉스필드 풀코스" output/01강_*/PPT/*.html
```

publish-deck Step 0에서 자동 호출 권장.

---

## 체크리스트 (수동 사용)

새 회차 PPT/튜토리얼 작성 직후 체크:

### PPT
- [ ] CONCEPT 슬라이드의 첫 bullet-detail에 비유사전 비유 1개 등장 (TONE-1A)
- [ ] 기술 용어 직설 0건 (TONE-1B)
- [ ] 영어 메뉴명에 한글 풀이 괄호 동반 (TONE-3A · 슬라이드 단위)
- [ ] SVG 안 영어 단독 노출 0건 (TONE-3B)
- [ ] 추측 어휘 0건 (TONE-3D)
- [ ] PPT 안 스크린샷 0건 (TONE-4A)
- [ ] bullet-text 한 항목 안 동작 동사 1개 (TONE-5A)
- [ ] 결과 약속·연령호명·시간표기 0건 (TONE-G1·G2·G3)

### 튜토리얼
- [ ] Step당 동작 동사 ≤ 2개 (TONE-2B)
- [ ] Step당 묶음 어미 ≤ 1회 (TONE-2A)
- [ ] Step당 "왜?" 1줄 이유 동반 (TONE-2C · 수동)
- [ ] 스크린샷 파일명 표준 (TONE-4C · 수동)
- [ ] 결과 약속·연령호명 0건 (TONE-G1·G2)

---

## 참조

- `lecture.config.json` audience.tone_principles 6항 — 본 SSOT 근거
- `_design/dictionaries/비유사전.md` — TONE-1A 비유 30개 lookup
- `_design/dictionaries/메뉴풀이사전.md` — TONE-3A·3C 메뉴 50개 lookup
- `_design/screenshot-policy.md` — TONE-4 스크린샷 규약
- `_design/regression-briefing.md` Case 6·7·8·9·10 — 본 룰의 예방 사례
- `.claude/rules/inline-glossary.md` v2 — 슬라이드 단위 첫 등장 정의

## 개정 이력
- 2026-05-02 · v1.0 · 초안 (왕왕초보 강의 신규 SSOT · 12개 lint 룰 박제)
