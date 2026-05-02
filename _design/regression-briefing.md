# Regression Briefing · 힉스필드 풀코스 PPT 생성용

> Phase 0-2 사전 설계 산출물.
> svg-designer / html-renderer / bullet-writer / public-lecture-writer 에이전트 시스템 프롬프트에 주입하여 같은 실수 반복 차단.
> **베이스**: 1번 강의 5건 (책갈피 토글·CSS-vs-SVG transform·텍스트 겹침·Space 키·view 전파) **그대로 승계** + 왕왕초보 신규 5건 추가.

---

## A. 1번 강의 회귀 5건 (그대로 승계 · 절대 재발 금지)

상세는 1번 강의 `output/_design/regression-briefing.md` 참조. 본 강의도 동일 SSOT(`common-js-bug-prevention.md` 불변 1·2·3·4 + `svg-design.md` 불변 0·0-1) 적용.

| # | 사례 | 검증 명령 |
|:---:|---|---|
| 1 | 책갈피 토글 SSOT 위반 (2026-04-29 230개 PPT) | `node .claude/scripts/check-toggle-handler-parity.mjs --dir output` |
| 2 | CSS-vs-SVG transform 충돌 (불변 0조) | `grep 'class="svg-' output/**/*.html` → 0 |
| 3 | 텍스트·박스 겹침 (불변 0-1조) | `node .claude/scripts/detect-svg-text-overlap.mjs` |
| 4 | Space 키 슬라이드 자동 이동 (불변 1) | `grep -c blurActiveIfButton output/assets/common.js` ≥ 3 |
| 5 | view 파라미터 자동 전파 누락 (불변 2) | `grep -c preserveViewParam output/assets/common.js` ≥ 1 |

---

## B. 왕왕초보 강의 신규 회귀 5건 (재발 절대 금지)

### Case 6 · 영어 메뉴 단독 노출 → 한글 풀이 누락

**증상 (예상)**: PPT bullet 또는 SVG에 `Marketing Studio`·`Hermes Agent`·`Soul ID`·`UGC` 같은 영어 단독 노출. 왕왕초보 시청자가 "그게 뭔지" 알 수 없음.

**원인 (예상)**:
- `inline-glossary.md` v2(슬라이드 단위 첫 등장 풀이) 무시
- "이미 앞 슬라이드에서 풀었으니 생략" 잘못된 판단
- SVG 라벨은 길이 제약상 영어로만 박는 관행

**예방**:
- 모든 영어 메뉴명·약어는 **슬라이드 단위 첫 등장 시 한글 풀이 1회 의무** (bullet-detail에서 또는 SVG 안에서)
- SVG 라벨 영어 단독 금지 — `Generate (만들기)` 또는 `만들기` 로 표기
- 메뉴풀이사전 50개 (`_design/dictionaries/메뉴풀이사전.md`) 박제 후 그것만 사용
- 검증: `tone-lint.mjs` 가 SVG 안 영어 단독 검출 → 실패 처리

### Case 7 · bullet 3개+ 인지부하

**증상 (예상)**: 슬라이드 한 장에 bullet 3~4개. 1번 강의 표준이지만 왕왕초보는 "읽다 까먹음" 발생.

**원인 (예상)**:
- 1번 강의 `density-budget.json`(concept.bullet_max=4) 그대로 사용
- bullet-writer 에이전트가 "정보 풍부 = 좋은 슬라이드"로 오판

**예방**:
- 본 강의 `density-budget.json` concept.bullet_max=**2**, hook.bullet_max=**2** 박제
- bullet-writer 시스템 프롬프트에 "왕왕초보 max 2" 명시
- 검증: 슬라이드별 bullet 개수 자동 카운트 → 2 초과 시 실패

### Case 8 · 임의 추측 메뉴 위치 ("아마 이 메뉴 누르면")

**증상 (예상)**: PPT 또는 튜토리얼에 "오른쪽 위에 있을 거예요" 같은 추측. 실제 인터페이스와 다름 → 학생 혼란·신뢰 ↓.

**원인 (예상)**:
- 인터페이스 가이드(`starter/input/materials/higgsfield-reference/higgsfield-interface-2026-05-02.md`) 미참조
- 도구 라이브 검증(`tool-live-higgsfield-2026-05-02.md`) 6개월 이상 경과 시 메뉴 변경 가능성

**예방**:
- 모든 PPT·튜토리얼 작성 시 **인터페이스 가이드 SSOT 절대 우위** 박제
- "추측" 어휘(아마·보통·~일 거예요) lint 자동 검출
- 메뉴 변경 발견 즉시 인터페이스 가이드 새 날짜 캡처 + reference-lock.json 갱신
- 검증: `tone-lint.mjs` 추측 어휘 검출 (audience-tone-checklist.md 항목 3)

### Case 9 · 비유 없이 개념 직설 ("이 모델은 transformer 기반")

**증상 (예상)**: PPT bullet-detail에 "Transformer 기반 멀티모달 모델" 같은 기술 용어 직설. 왕왕초보 이해 불가.

**원인 (예상)**:
- audience.tone_principles 1항(비유 우선) 무시
- LLM이 학습한 기본 정의 그대로 출력

**예방**:
- 모든 개념 도입은 **일상 비유 먼저 → 도구 용어 도입** 순서 (비유사전 30개 사용)
- bullet-writer 에이전트 시스템 프롬프트에 "기술 용어 직설 금지" 명시
- 검증: `tone-lint.mjs`가 금지 용어 사전(transformer·multimodal·diffusion 등) 검출

### Case 10 · 가상 클라이언트 없이 추상적 결과물

**증상 (예상)**: "여러분의 콘텐츠를 만들어보세요" 같은 추상 안내. 왕왕초보는 "내 사업 어떻게 적용?" 매핑 불가.

**원인 (예상)**:
- content-policy.md 가상 클라이언트 정책 무시
- 회차 작성 시 클라이언트 매핑 단계 생략

**예방**:
- 모든 회차의 실습은 **가상 클라이언트 A·B·C·D 중 핵심 1종 선택** 박제 (`커리큘럼.md` 박제)
- 회차 1·2·3은 환경 셋업 → 4종 모두 공통
- 회차 4부터는 각 회차 Cover에 "오늘의 클라이언트: A 카페 사장" 명시
- 검증: 회차별 PPT cover/overview에 가상 클라이언트 명시 여부 자동 체크

---

## C. 시각 검증 체크포인트 (Playwright 캡처) · 1번 강의 승계

생성 후 반드시 수행:
```bash
node .claude/scripts/capture-ppt-slides.mjs --lecture-dir "../lectures/힉스필드 풀코스" --dir output/<회차>
```

육안 체크 (1번 강의 + 왕왕초보 추가):
- [ ] 텍스트가 도형 경계 밖으로 삐져나감
- [ ] 텍스트 ↔ 텍스트 겹침
- [ ] 이모지가 도형 중앙 이탈
- [ ] 화살표가 목표 도형과 연결되지 않음
- [ ] 배경 장식이 텍스트 가독성 침해
- [ ] 자동 줄바꿈으로 단어 끊김
- [ ] **(왕왕초보) SVG 안 영어 단독 노출 — 모든 영어에 한글 병기 또는 한글만**
- [ ] **(왕왕초보) bullet 3개 이상 슬라이드 — 2개 이하로 축소**

---

## 참조

- `.claude/rules/common-js-bug-prevention.md` — 불변 1·2·3·4 (1·5·10번 사례)
- `.claude/rules/svg-design.md` — 불변 0·0-1 (2·3번 사례)
- `.claude/rules/inline-glossary.md` v2 — 슬라이드 단위 첫 등장 풀이 (6번 사례)
- `_design/audience-tone-checklist.md` — 6항 자동 lint (8·9·10번 사례)
- `_design/dictionaries/비유사전.md` — 9번 사례 예방
- `_design/dictionaries/메뉴풀이사전.md` — 6번 사례 예방
- `_design/screenshot-policy.md` — 튜토리얼 스크린샷 정책 (왕왕초보 예외)

## 개정 이력

- 2026-05-02 · v1.0 · 1번 강의 5건 승계 + 왕왕초보 신규 5건 박제
