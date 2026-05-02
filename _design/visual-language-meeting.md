# Visual Language Meeting · 힉스필드 풀코스 (5인 가상 회의록)

> Phase 0-2 사전 설계 산출물. 20회차 × 평균 9파트 = 약 180 PPT 파트의 시각 언어 합의안.
> **일자**: 2026-05-02
> **베이스**: 1번 강의 `output/_design/visual-language-meeting.md` (v1) + 왕왕초보 적응

## 참석자

| 역할 | 책임 |
|------|------|
| P1 시각 디자인 | 타이포·레이아웃·색상 · 1번 강의 골든 복제 검증 |
| P2 교육 UX | 인지부하·시선 흐름·왕왕초보 학습 효율 |
| P3 프론트엔드 | CSS·SVG·common.js 단일 진실 공급원 준수 |
| P4 교재 설계 | 정보 위계·메뉴풀이사전·비유사전 일관성 |
| P5 QA | 자동 검증·회귀 방지·`tone-lint.mjs` 강제 |

---

## 의제 1 · 메타포 통일

**원본 분석**: Higgsfield는 멀티모델 플랫폼(15+ 외부·자체 모델 단일 구독). 왕왕초보가 "도대체 뭐가 어디 있는 거야"를 즉시 해소할 단일 메타포 필요.

**합의 메타포** (회차 1에서 박제 → 20회차 일관):
- **Higgsfield = 셰프가 여러 명 있는 큰 주방** (P4 제안 · 만장일치)
  - 메뉴판 = 모델 선택 (Soul·Kling·Sora 등)
  - 셰프별 특기 = 모델별 특기 (Soul 인물·Kling 영상·Sora 시네마)
  - 주방 입구 = Generate 버튼 (만들기 시작)
  - 식자재 창고 = Assets (내가 만든 결과물 보관)
  - 결제대 = Pricing (크레딧 충전)

**부메타포 (회차 1개 추가 OK, 비유사전 안에서만)**:
- 카메라(Cinema Studio) · 앞치마(Soul ID 학습) · 액자(종횡비) · 지하철 카드(크레딧) · 요리 레시피(프롬프트)

**금지**: 회차마다 새 메타포 발명 (인지 분산). 1번 강의 메타포(오케스트라·악단)도 본 강의에서는 사용 안 함.

---

## 의제 2 · 색상 강조 포인트 (1번 강의 100% 승계)

**합의** — `starter/output/assets/common.css` `:root` 박제 그대로:
- 핵심 키워드·숫자: `--gold` (#e2c793) — 시선 집중
- 본문 텍스트: `--cream` (#F7F0DF) / `--text` (#E8E0CC)
- 보조 라벨: `--muted` (#7a7666) — 부각 약화
- 어두운 테두리·구분선: `--dim` (#3a3730)
- ❌ 다른 색상 절대 금지 (design-tokens.md 불변)

**금색 집중 포인트**:
- Cover 슬라이드의 PART 번호 + typewriter 타이틀
- bullet-num (01·02)
- SVG 핵심 도형의 stroke
- 강사 노트 active 문장 배경 (rgba(80,80,80,0.9))
- 메뉴풀이 괄호 안 한글 (선택 · 강조 시)

---

## 의제 3 · SVG 복잡도 (왕왕초보 단순화)

| 등급 | 정의 | 적용 회차 |
|------|------|-----------|
| Simple (3~5 elements) | GUI 메뉴 1개 강조·아이콘 1개 | 01·02·03·08·20 (입문·메뉴투어·종합) |
| Medium (5~7 elements) | GUI 흐름 다이어그램 + 라벨 | 04·05·06·07·09·10·11·12·13·14·15·16·17·18·19 (대부분) |
| Complex (8~10 elements) | 채널×모델 매트릭스·트리·풀 매핑 | 20강만 (마지막 종합) |

**SVG text 상한 5** (1번 강의 8 → 5로 축소):
- 왕왕초보는 슬라이드 시선 평균 1.5초 머무름
- 5 이상이면 "안 본 텍스트 발생" → 인지 누락

---

## 의제 4 · 금지 조합 재확인 (1번 강의 승계 + 왕왕초보 추가)

**`.claude/rules/svg-design.md` 불변 0조 + 0-1조 준수**:
- ❌ `<g class="svg-pulse" transform="...">` — CSS transform이 SVG transform 덮어씀
- ❌ 박스 간격 < 15px 가로 / 10px 세로
- ❌ 텍스트 AABB 겹침 (font-size × 0.55 + 8px 미만)
- ❌ 제네릭 ?·CORE+4원형·META 동심원+4코너박스
- ❌ 같은 회차 내 동일 아키타입 3회 초과
- ❌ 인접 회차 첫·마지막 CONCEPT 동일 아키타입

**왕왕초보 추가 금지** (P4 제안 · 만장일치):
- ❌ **SVG 안 영어 단독 노출** — 반드시 한글 병기 또는 한글만 (예: `Generate` ✗ → `Generate (만들기)` 또는 `만들기`)
- ❌ 추측성 메뉴 위치 시각화 ("아마 우측에" 같은) — 인터페이스 가이드 의무 참조
- ❌ 가격 단독 노출 ($34) — `$34/월 (약 5만원)` 한글 환산 동반
- ❌ 모드명 단독 (UGC·TV Spot) — 풀이 없으면 SVG 라벨 사용 금지

---

## 의제 5 · 추가 디자인 요소 (1번 강의 골든 복제)

**합의**:
- 배경 모드 5종 라운드로빈 (FLOW·NETWORK·WAVES·VORONOI·CONSTELLATION)
- Cover 타이틀: typewriter 효과 + 워드 페이드인 (불변 3 · 폭 고정 opacity reveal)
- 책갈피 토글: common.js 단독 (불변 4) — inline onclick toggle 금지
- 강사 노트: details + 노래방 모드 + ?view=teacher/student 자동 전파 (불변 1·2)
- 4중 채널 동기화: BroadcastChannel + postMessage + localStorage + MutationObserver
- **상대 단위만** (불변 v3 · 2026-04-24) — px 절대값 금지

**왕왕초보 차별점**:
- 책갈피 max 2개 (1번 강의는 4개) — `density-budget.json` concept.bullet_max=2
- 인포그래픽 width 75%·max-height 63vh (1번 강의와 동일 v4)
- Cover typewriter 메시지 짧게 (15자 이내) — "오늘은 영상 첫 시작" 같은

---

## 의제 6 · 1번 강의 대비 차이 (P5 검증 항목)

| 항목 | 1번 강의 | 본 강의 (왕왕초보) | 검증 |
|---|---|---|---|
| bullet-text 상한 | 4 (concept) | **2** | density-budget.json |
| SVG text 상한 | 8 | **5** | density-budget.json + svg-self-verify |
| 메타포 | 오케스트라 (단일) | **셰프 주방** (단일) | 비유사전 30개 |
| 가상 클라이언트 | 사용 안 함 | **A·B·C·D 4종** | content-policy.md |
| 영어 메뉴 풀이 | bullet-detail에서만 | **SVG 안에서도 의무** (왕왕초보 강화) | 메뉴풀이사전 50개 |
| 스크린샷 | PPT·튜토리얼 모두 0 | **튜토리얼만 적극 사용** (PPT 0 유지) | screenshot-policy.md |
| 디자인 시스템 | starter common.css/js | **starter common.css/js 100% 동일** | reference-lock.json |

---

## 5인 합의 서명

- ✅ P1 (시각 디자인) — 1번 강의 골든 100% 복제 합의 · reference-lock.json 박제
- ✅ P2 (교육 UX) — 정보 밀도 budget 축소 (4→2, 8→5) 강제 적용
- ✅ P3 (프론트엔드) — common.css/js 단일 진실 공급원 그대로 사용 · 인라인 금지
- ✅ P4 (교재 설계) — 비유사전 30개·메뉴풀이사전 50개 박제 후 임의 발명 금지
- ✅ P5 (QA) — `tone-lint.mjs` 6항 자동 검증 · 영어 단독 SVG 검출 · Phase 0 누락 차단

**회의 종료**: 2026-05-02
