# Higgsfield Live Research (2026-05-02 · Baseline v1.1)

> **v1.1 갱신 (2026-05-02 후반)**: 사용자 메인 화면 캡처 기반 가이드 (`starter/input/materials/higgsfield-reference/higgsfield-interface-2026-05-02.md`)와 통합. 차이점:
> - **Cinema Studio 3.0 → Cinema Studio 3.5** (사용자 캡처 우선)
> - 글로벌 네비 메뉴에 **Audio · Edit · Originals · Apps · Assist · Community** 추가 (총 15개)
> - 메인 액션 카드 7개 정확히 박제 (Generate Image · Generate Video · Seedance 2.0 · Nano Banana Pro · Higgsfield MCP · Marketing Studio · Cinema Studio 3.5)
>
> **상위 SSOT**: 인터페이스 표기·메뉴명은 `starter/input/materials/higgsfield-reference/`가 절대 우위. 본 문서는 보조.

---


> **목적**: 강의 "왕초보를 위한 힉스필드 A to Z 풀코스" (20회 · 왕왕초보) 자료 작성을 위한 도구 학습 baseline.
> **SSOT**: starter `.claude/_archive/rules-extended/tool-live-verification.md` (T1·T2·T3)
> **다음 갱신**: 2026-05-09 (1주 후 · cron 자동)
> **참고**: 가격 정보는 출처별 차이가 있으므로 강의 회차 작성 직전 공식 pricing 페이지 재확인 의무.

---

## TL;DR (3줄)

- **Higgsfield**는 Sora 2·Veo 3.1·Kling 3.0·Seedance 2.0 등 15+ 외부 모델 + 자체 Soul 2.0(이미지)·Cinema Studio·Marketing Studio를 **단일 구독**으로 묶은 멀티모델 영상·이미지 생성 플랫폼. 2026-01 Series A 연장 $80M, 밸류 $1.3B, 1,500만+ 유저.
- **강점**: 시네마틱 카메라 컨트롤 70+ 프리셋 · Marketing Studio의 UGC 광고 자동화(Hermes Agent) · Soul ID 캐릭터 일관성. **약점**: 크레딧 소모량이 크고 "Unlimited"가 사실상 제한적, 90일 만료, 청구·환불 분쟁 다수.
- **왕왕초보 평가**: 영어 UI + 9가지 모드 + 크레딧 계산 부담. 강의용 "메뉴풀이사전" 필수, Free 10크레딧/일로 체험 → Plus($39 또는 $34) 권장.

---

## 1. T1 공식 인벤토리 (MCP 직접 호출 + 공식 사이트)

### 1-1. 모델 인벤토리 (MCP 추출 · 2026-05-02 시점)

#### 이미지 모델 (17개)
| 모델 | 제공사 | 특징 | 강의 활용 |
|---|---|---|---|
| Nano Banana 2 | Google | 빠른 고품질 1k/2k/4k | 인스타 피드 |
| Nano Banana Pro | Google | 텍스트·다이어그램 4k | 포스터·텍스트 이미지 |
| Nano Banana | Google | 저비용 사실적 | 대량 생성 |
| **Higgsfield Soul 2.0** | Higgsfield | UGC·패션·인물 · Soul ID | **강의 핵심** (인물·캐릭터) |
| Soul Cinema | Higgsfield | 시네마틱 스틸 | 영화 콘셉트 |
| Seedream 4.5 | Bytedance | 4K 정밀 제어 | 고해상도 광고 |
| Seedream 5.0 lite | Bytedance | 시각 추론·편집 | 이미지 수정 |
| Z Image | Tongyi-MAI | 빠르고 저렴 | 빠른 시안 |
| Flux 2.0 | Black Forest | 프롬프트 정확 (pro/flex/max) | 프롬프트 학습 |
| Flux Kontext Max | Black Forest | 컨텍스트 편집·스타일 전송 | 리믹스 |
| Kling O1 Image | Kling | 사실적·와이드 종횡비 | 풍경 |
| GPT Image 1.5 | OpenAI | 텍스트 렌더링 최강 | 로고·인포그래픽 |
| GPT Image 2 | OpenAI | 4K + 텍스트 렌더링 차세대 | **포스터·배너** |
| Grok Imagine | xAI | 고대비·표현적 | 강한 비주얼 |
| Cinema Studio Image 2.5 | Higgsfield | 시네마틱 4K | 영화 포스터 |
| **Marketing Studio Image** | Higgsfield | 원클릭 제품 광고 | **이커머스 SNS 광고** |
| Soul Cast / Soul Location | Higgsfield | 캐릭터 ID·배경 | 시리즈 콘텐츠 |
| Auto | Higgsfield | 자동 모델 라우팅 | 왕왕초보 default |

#### 영상 모델 (12개+)
| 모델 | 제공사 | 특징 | 강의 활용 |
|---|---|---|---|
| **Seedance 2.0** | Bytedance | 레퍼런스 기반 · 4-15s · 오디오 | 틱톡 토킹헤드 |
| Seedance 1.5 Pro | Bytedance | 안정 모션 4·8·12s | 입문 영상 |
| Minimax Hailuo | Hailuo | 자연 물리·표정 6·10s | 캐릭터 |
| Wan 2.6 / 2.7 | Wan | 스타일라이즈드 / 오디오 동기화 | 실험 |
| **Kling 2.6 / 3.0** | Kling | 시네마틱 모션·멀티샷·오디오 | **인스타 릴스 9:16** |
| Grok Video | xAI | 텍스트·이미지 → 영상 | 빠른 시안 |
| **Google Veo 3 / 3.1** | Google | 시네마틱·울트라 사실적 | **유튜브 쇼츠·광고** |
| Veo 3.1 Lite | Google | 빠르고 저렴 | 배치 생성 |
| **Cinema Studio Video 3.0** | Higgsfield | 가장 진보된 시네마 | **광고용 시네마틱** |
| Cinema Studio Video v2 | Higgsfield | 장르 컨트롤 (action·horror·comedy 등) | 콘텐츠 분위기 |
| **Marketing Studio Video** | Higgsfield | 원클릭 제품 광고 · TikTok·Reels | **이커머스 광고** |

### 1-2. 가격·크레딧 모델 (2026-05 기준 · ⚠️ 출처별 상이)

> 강의 직전 1주 이내 공식 페이지 직접 확인 필수.

| 플랜 | 월 USD (연결제) | 크레딧/월 | 주요 |
|---|---|---|---|
| Free | $0 | 10/일 | 기본 모델만 |
| Starter | $15 | 200 | Soul 2.0 일부 |
| **Plus** ⭐ | $34~39 | 1,000 | 365일 unlimited 이미지 모델 (왕왕초보 추천) |
| Ultra | $84~99 | 3,000 (~9,000) | unlimited 비디오 모델 1개 |
| Business | $31~49/seat | 공유 | Seedance 2.0 독점, 분석 |

- **Top-up 팩**: 약 $5/100크레딧 · **90일 만료** · 월 롤오버 없음
- **모델별 크레딧**: Kling 3.0 ~6 · Soul 이미지 0.25~5 · Sora 2·Veo 3.1 영상 1편 40~70
- **실효 단가** (Plus): 사용 가능한 클립 1개당 $0.61~$1.03 (재시도 포함)

### 1-3. 최근 changelog·신규 기능 (2026 출시 5건+)

| 날짜 | 기능 | 1줄 |
|---|---|---|
| **2026-04-23** | **Marketing Studio + Hermes Agent** | UGC 트렌드 스캔 → 광고 자동 |
| 2026-04-14 | Marketing Studio · 제품→광고 무봉합 | Brooklyn 스킨케어 +12% CTR 사례 |
| 2026-03-04 | Soul Cinema Preview | 캐릭터 일관성 강한 시네마틱 |
| **2026-02-17** | **Soul 2.0 출시** | 20+(60+) 미적 프리셋, Soul ID, Soul Reference |
| 2026 | Cinema Studio 3.0 | 풀 프롬프트 라이브러리 |
| 2026 | Seedance 2.0 통합 | 모션·오디오·립싱크 단일 패스 |
| 2026 | Higgsfield MCP 출시 | AI 에이전트 안에서 콘텐츠 생성 |
| 2026 | GPT Image 2 통합 | 4K + 텍스트 렌더링 |

### 1-4. 영어 메뉴풀이사전 시드 (16개 → 50개로 확장 예정)

| 영어 | 한글 풀이 | 비고 |
|---|---|---|
| Generate | 만들다 (이미지·영상 시작 버튼) | 가장 자주 |
| Canvas | 캔버스 (시각 작업 공간) | Workflow 시각화 |
| Collab | 협업 (팀원 초대) | Business 전용 |
| Edit | 편집 (생성 후 수정) | |
| Character | 캐릭터 (등장 인물) | Soul ID와 연결 |
| **Marketing Studio** | 마케팅 스튜디오 (광고 자동 생성) | 강의 핵심 |
| **Cinema Studio** | 시네마 스튜디오 (영화 같은 영상) | |
| Originals | 오리지널 (Higgsfield 자체 모델) | |
| MCP | MCP (외부 AI에서 호출) | 강의에서 가볍게만 |
| Apps | 앱 (얼굴 교체·트랜지션 등 100+ 도구) | |
| Assist | 어시스트 (AI 도우미) | |
| Community | 커뮤니티 (다른 사용자 작품) | |
| **Soul** | 솔 (인물 사진 생성 모델) | |
| Soul ID | 솔 ID (내 사진 학습 → 일관 캐릭터) | |
| Soul Reference | 솔 레퍼런스 (이미지 → 이미지) | |
| **Hermes Agent** | 헤르메스 에이전트 (UGC 트렌드 자동 분석) | |
| Seedance | 시드댄스 (Bytedance 영상 모델) | |
| Veo | 베오 (Google 영상 모델) | |
| Kling | 클링 (Kling AI 영상 모델) | |
| Sora | 소라 (OpenAI 영상 모델) | |
| Nano Banana | 나노 바나나 (Google 이미지 모델) | |
| **UGC** | UGC = User Generated Content (사용자 생성 콘텐츠 · 광고 모드) | |
| Wild Card | 와일드 카드 (자유 모드) | |
| Hyper Motion | 하이퍼 모션 (역동적 영상) | |
| Pro Virtual Try-On | 프로 가상 착용 (의류·뷰티) | |
| TV Spot | TV 스팟 (TV 광고 형식) | |
| Top-up | 충전 (크레딧 추가 구매) | |

---

## 2. T2 최근 1주 인기 자료 (8건)

| 출처 | URL | 게시일 | 핵심 |
|---|---|---|---|
| **AI Funnel Insider** | aifunnelinsider.com/higgsfield-ai-review-2026 | 2026 | Plus $39가 sweet spot · 청구 분쟁 경고 |
| Memorable Studio | memorable-studio.com/reviews/higgsfield-ai | 2026-03 | 40% 재생성 필요 · Pro $75 미만 비추천 |
| Cybernews | cybernews.com/ai-tools/higgsfield-ai-review | 2026 | "Cinematic AI Video Generator" |
| Filmora (Wondershare) | filmora.wondershare.com/ai-generation/higgsfield-ai-review | 2026 | "Best Cinematic AI Video Tool" |
| **VO3AI 블로그** | vo3ai.com/blog/higgsfield-marketing-studio-just-launched | **2026-04-23** | Hermes Agent 5가지 활용법 (UGC 변환) |
| 캐럿 (한국) | carat.im/blog/higgsfield-ai-guide | 2026 | Soul 2.0 한국어 가이드 |
| 이랜서 (한국) | elancer.co.kr/blog/detail/1039 | 2026 | 이미지→시네마틱 영상 변환 |
| **Forbes Korea** | forbeskorea.co.kr/news/articleView.html?idxno=401745 | 2026-02 | "폭발적 성장에 숨은 민낯" — vibe motion 허위광고 폭로 |

---

## 3. T3 경쟁 위치 (vs Sora·Kling·Veo·Runway·Pika)

**Higgsfield 포지션**: "올인원 멀티모델 셔터" — 15+ 모델 단일 구독으로 묶음. Sora 2 + Veo 3.1 + Kling 직구독 시 $200+/mo이 $34~99로.

| 경쟁 | Higgsfield 대비 |
|---|---|
| **Sora 2** (OpenAI) | Sora가 사실성·내러티브 우위 / Higgsfield는 Sora 2를 내장 + 카메라 컨트롤로 보강 |
| **Kling 3.0** (Kling AI) | Kling이 인간 얼굴·립싱크·속도 우위 / Higgsfield는 Kling 내장 + 프리셋 |
| **Runway Gen-4** | Runway가 모션 브러시·Aleph·Act-Two 우위 / Higgsfield는 시네마틱 컨트롤 우위 |
| **Pika · Arcads** | Arcads가 UGC 토킹헤드 전용 더 강함 |

---

## 4. 왕왕초보 관점 위험 신호 (강의에 반드시 박제)

1. **영어 UI** — 메뉴·모드명 모두 영어 (한국어 프롬프트는 OK). 9가지 Creative Mode (TV Spot · UGC · Tutorial · Product Review · Unboxing · UGC Virtual Try-On · Hyper Motion · Pro Virtual Try-On · Wild Card)는 풀이 없으면 의미 불명.
2. **학습 곡선** — 모델별 크레딧 6 vs 70 (10배 차이). 잘못 누르면 한 번에 소진.
3. **공식 한국어 문서 없음** — 한국어 블로그 가이드 의존 (강의에서 채워주는 가치).
4. **신뢰 이슈** — 2026-02 vibe motion 허위광고 폭로(Forbes Korea). 강의 회차 1에서 "도구 약점·한계" 슬라이드로 박을 것.
5. **청구 함정** — 자동갱신 환불 7일 + 크레딧 0 사용 시만. 90일 만료. 회차 1 또는 회차 2에 1슬라이드 박기 필수.

---

## 5. 강의 자료 활용 시 주의사항

### 5-1. 회차당 다룰 만한 기능 (16개 후보 → 20회 매핑 1차안 · P2에서 확정)

1. **회원가입 + Free 체험 + 메뉴풀이사전** (왕왕초보 스타트)
2. Soul 2.0 인물 사진 생성 (60+ 프리셋)
3. Soul ID 캐릭터 일관성 (자기 사진 학습)
4. Soul Reference 이미지→이미지
5. Nano Banana Pro 이미지 (인스타 피드)
6. GPT Image 2 텍스트 포함 이미지 (포스터·배너)
7. Kling 3.0 영상 기초 (인스타 릴스 9:16)
8. Seedance 2.0 영상 + 립싱크 (틱톡 토킹헤드)
9. Sora 2 영상 (유튜브 쇼츠 시네마틱)
10. Veo 3.1 영상 (페북 광고)
11. Cinema Studio 3.0 카메라 컨트롤 (광고용 시네마틱)
12. **Marketing Studio · 제품 URL → 광고** (이커머스)
13. Marketing Studio · UGC 모드 (앱 마케터)
14. Marketing Studio · Pro Virtual Try-On (의류·뷰티)
15. Hermes Agent 트렌드 활용
16. Canvas 워크플로우 (반복 패턴 자동화)
17. 100+ Apps · face swap·transition (쇼츠 효과)
18. Image-to-Video 변환 (제품 사진 → 광고 영상)
19. **크레딧 절약 + 모델별 비용 의사결정** (왕왕초보 핵심)
20. **결과물 채널 매칭** (인스타·틱톡·쇼츠·페북·이메일·블로그)

### 5-2. 결과물 채널 ↔ 모델 추천 매핑

| 채널 | 종횡비 | 추천 모델·모드 |
|---|---|---|
| 인스타 피드 | 1:1·4:5 | Soul 2.0 + Nano Banana Pro |
| 인스타 릴스 | 9:16 | Kling 3.0 + Cinema Studio |
| 틱톡 | 9:16 UGC | Seedance 2.0 + Marketing Studio UGC |
| 유튜브 쇼츠 | 9:16 | Sora 2 + Cinema Studio Video 3.0 |
| 페북 광고 | 1:1·4:5 | Veo 3.1 + Marketing Studio TV Spot |
| 페북 일반 | 16:9·1:1 | Marketing Studio + Soul 2.0 |
| X (트위터) | 16:9 | Veo 3.1 Lite |
| 이메일·블로그 헤더 | 16:9 | GPT Image 2 (텍스트 렌더링 강) |

---

## 6. 검증 메모 (다음 갱신 시 재확인)

- **모순 정보**: 가격 표기 출처별 차이. 강의 직전 1주 이내 공식 pricing 페이지 직접 확인 필수.
- **Soul 2.0 프리셋 개수**: 공식 블로그 "20+" vs T2 자료 "60+" — 양쪽 모두 명시 가능.
- **Marketing Studio 모드 수**: 9가지 (TV Spot · UGC · Tutorial · Product Review · Unboxing · UGC Virtual Try-On · Hyper Motion · Pro Virtual Try-On · Wild Card) — 공식 marketing-studio-intro 페이지 확인됨.
- **신뢰 이슈**: vibe motion 허위광고 폭로(Forbes Korea · 나무위키)는 강의 회차 1에 "리스크 안내" 슬라이드로 박을지 결정 필요.

---

## 7. 출처 (Primary)

### T1 공식
- https://higgsfield.ai/
- https://higgsfield.ai/pricing
- https://higgsfield.ai/blog
- https://higgsfield.ai/marketing-studio-intro
- https://higgsfield.ai/blog/SOUL-2.0-Realistic-AI-Image-Generator-for-Creative-Direction
- Higgsfield MCP 직접 호출 (`models_explore` · 2026-05-02 · 35+ 모델 인벤토리)

### T2 최근 자료
- https://aifunnelinsider.com/higgsfield-ai-review-2026/
- https://memorable-studio.com/reviews/higgsfield-ai/
- https://www.vo3ai.com/blog/higgsfield-marketing-studio-just-launched-5-ways-hermes-agent-is-changing-ai-ugc-2026-04-23
- https://carat.im/blog/higgsfield-ai-guide
- https://www.elancer.co.kr/blog/detail/1039
- https://somako.co.kr/마케터에게-유용한-생성형-ai-힉스필드-higgsfield-사용법/
- https://letter.wepick.kr/post/23984
- https://www.forbeskorea.co.kr/news/articleView.html?idxno=401745

### T3 교차·비교
- https://geo.higgsfield.ai/higgsfield-ai-vs-other-ai-video-tools-2026
- https://www.imagine.art/blogs/higgsfield-ai-pricing
- https://invideo.io/blog/kling-vs-sora-vs-veo-vs-runway/
- https://namu.wiki/w/Higgsfield

---

## 8. Fitness Declaration (강의 적합성 5항)

1. **도구 주 기능** (제조사 공식): 멀티모델 영상·이미지 생성 SaaS (Sora·Veo·Kling·Seedance·자체 Soul·Cinema·Marketing Studio)
2. **강의 실습 목적**: SNS 콘텐츠(릴스·틱톡·쇼츠·페북·X) + 마케팅 광고 영상 만들기
3. **일치 여부**: ✅ 예 — Higgsfield의 Marketing Studio + Cinema Studio가 강의 결과물(SNS·광고)과 정확히 일치. 주경로로 사용 적합.
4. **수강생 재현 필요물**: Higgsfield 계정(Free 체험 가능 · Plus $34~39 권장) · Chrome 브라우저 · 인스타·틱톡·유튜브 계정 (결과물 업로드용 · 본인 보유)
5. **실패·차단 시 대체 경로**:
   - Higgsfield 서비스 다운 → Pika·Arcads·Sora 직접 사용 (학생 사례 비교용으로만)
   - 크레딧 소진 → Free 10크레딧/일 또는 Top-up
   - 봇 차단으로 자동화 안 됨 → 모든 시연 사용자 직접 진행 (이미 자동화 폐기 결정)

---

© PajamaBoss · 2026-05-02 · v1 baseline · 자동 갱신 cron 등록 예정
