# Screenshot Policy · 힉스필드 풀코스 (신규 SSOT)

> Phase 0-2 신규 SSOT. 1번 강의 `tutorial-screenshot-requirement.md` v2(스크린샷 0건 정책)의 **예외 적용**.
> 본 강의는 GUI 도구(Higgsfield) 학습이라 스크린샷 적극 활용 박제.
> **참조**: `lecture.config.json` audience.tone_principles 4항 · `content-policy.md` 가-4

---

## 핵심 정책

| 산출물 | 스크린샷 | 근거 |
|---|:---:|---|
| **PPT HTML** (`output/<회차>/PPT/part-XX.html`) | ❌ **0건 의무** | 1번 강의 정책 그대로 · PPT는 SVG 인포그래픽으로 시각화 · 스크린샷 임베드 시 디자인 토큰·layout 토큰 깨짐 |
| **실습 튜토리얼** (`output/<회차>/실습_튜토리얼/*.md`) | ✅ **적극 사용** | 왕왕초보 GUI 학습 · 텍스트만으로는 메뉴 위치 안내 불가능 |
| **노션 자료실** (튜토리얼 업로드 후) | ✅ 자동 변환 | martian이 마크다운 이미지를 노션 image 블록으로 변환 |
| **강사용 큐시트** (강사매뉴얼/) | ✅ 적극 사용 | 강사 시연 시 화면 위치 빠른 참조용 |

---

## 1. PPT HTML 안 스크린샷 금지 (0건 유지)

### 금지 이유
1. **디자인 시스템 깨짐**: `common.css` `--gold` `--cream` 색상 팔레트가 스크린샷의 화려한 색상에 묻힘
2. **layout 토큰 깨짐**: 스크린샷은 고정 픽셀 → 본 강의 상대 단위(`vh`·`vw`·`clamp()`) 정책 위반
3. **GitHub Pages 부담**: 회차당 평균 8 슬라이드 × 20회 = 160 슬라이드. 슬라이드당 5장 가정 시 800 PNG 파일.
4. **인터페이스 변경 시 일괄 갱신 부담**: Higgsfield UI는 `New` 배지 다수 (자주 변경) → 모든 PPT 일괄 갱신 사실상 불가
5. **불변 0조 위반 가능성**: 스크린샷이 SVG 안에 들어가면 `<image>` 태그 → CSS transform 충돌

### 검증
```bash
# PPT HTML 안 <img> 또는 <image> 또는 background-image 검출
grep -rE '<img\s|<image\s|background-image:\s*url' lectures/힉스필드\ 풀코스/output/*/PPT/*.html
# → 0건 의무 (cursor·logo 같은 SVG inline은 OK)
```

`tone-lint.mjs` TONE-4A 자동 검증.

### 대체 방안 (PPT 안 GUI 시각화)
- **SVG 인포그래픽으로 추상화**: 메뉴 위치는 박스+화살표+한글 라벨로
- **wireframe 스타일**: 실제 색상·이미지 없이 선·라벨만
- 예: "Image 메뉴 → Generate Image 버튼" → A3 FLOW_CHAIN SVG (3박스 화살표 연결)

---

## 2. 실습 튜토리얼 안 스크린샷 적극 사용

### 사용 시점 (Step별 권장)
- **모든 Step의 첫 번째 동작**: 메뉴 위치 보여주기 (1장)
- **결과 확인 단계**: 화면이 어떻게 바뀌는지 보여주기 (1장)
- **자주 헷갈리는 부분**: 흐림 처리·강조 박스 추가
- 1 Step당 평균 1~2장 (최대 3장 권장)

### 파일 위치
```
output/<NN>강_<주제>/
├── PPT/
└── 실습_튜토리얼/
    ├── part-NN_<주제>.md
    └── screenshots/
        ├── NN-step-N-설명.png       ← 표준
        ├── NN-step-N-설명@2x.png    ← 고해상도 (선택)
        └── NN-step-N-설명-blur.png  ← 민감정보 마스킹 (선택)
```

### 파일명 컨벤션
**형식**: `<회차2자리>-step-<번호>-<짧은영문설명>.png`

| 예시 | 설명 |
|---|---|
| `01-step-3-signup-form.png` | 1강 Step 3 회원가입 폼 |
| `04-step-2-image-menu.png` | 4강 Step 2 Image 메뉴 클릭 |
| `14-step-5-product-url-input.png` | 14강 Step 5 제품 URL 입력 |
| `15-step-3-hermes-trends-list.png` | 15강 Step 3 Hermes 트렌드 목록 |

**금지**:
- ❌ 한글 파일명 (`회원가입.png`) — git/GitHub Pages 한글 인코딩 트랩
- ❌ 공백·특수문자 (`step 3 (final).png`)
- ❌ 너무 긴 이름 (`how-to-click-the-marketing-studio-menu-from-explore-page.png`)

### 마크다운 임베드 형식
```markdown
![1강 Step 3 회원가입 폼](./screenshots/01-step-3-signup-form.png)
*↑ 회원가입 폼. 이메일·비밀번호 2개만 입력하면 끝이에요.*
```

설명 캡션은 *italic* 으로 동반 권장 (해요체).

---

## 3. 해상도·크기 규약

### 표준 해상도
| 용도 | 해상도 | 파일 형식 | 예상 크기 |
|---|---|:---:|---|
| 일반 캡처 | **1280×720** (16:9) | PNG | 50~150KB |
| 고해상도 (선택) | 2560×1440 (`@2x`) | PNG | 200~500KB |
| 모바일 화면 (인스타·틱톡) | **390×844** (9:16) | PNG | 30~80KB |
| 디테일 줌 | 800×600 임의 | PNG | 30~100KB |

### 형식
- **PNG 권장**: 메뉴·텍스트는 PNG가 선명
- **JPG 허용**: 사진·결과물 미리보기는 JPG OK (파일 크기 ↓)
- **WebP 금지**: 노션·이메일·일부 브라우저 호환성 낮음
- **GIF 금지**: 본 강의는 정적 스크린샷만 (애니메이션은 영상 녹화 SSOT 별도)

### 압축
- 업로드 전 `tinypng.com` 또는 `pngquant` 압축 권장 (50% 감소)
- GitHub LFS 미사용 (회차 20개 × 50장 = 1,000장 = 약 100MB → repo 무리 없음)

---

## 4. 민감정보 마스킹 의무

### 마스킹 대상
- **이메일 주소** (캡처 좌측 상단 사용자 프로필에 노출)
- **이름** (사용자 본명 노출)
- **결제 정보** (카드 번호 끝 4자리 노출)
- **잔액·크레딧 잔량** (사용자별 다름 → 일반화 어려움)
- **API 키·토큰** (개발자 도구 캡처 시)

### 마스킹 방법
1. **흐림 처리** (Photoshop·Preview·Skitch): 가우시안 blur 8px 이상
2. **검정 박스 덮기**: `#0D0D0D` (디자인 토큰 `--black`) 사각형 덮기
3. **가짜 정보 교체**: `email@example.com` 또는 `홍길동`
4. **크롭**: 민감 영역 잘라내기

### 검증
- 캡처 후 업로드 전 **각 PNG 직접 열어** 좌측 상단·우측 상단·중앙 확인
- 다른 사람이 봐도 노출 OK인 정보만 남기기

---

## 5. 캡처 시점 가이드

### 권장 캡처 순서 (강사 시연 기준)
1. **사전 준비**: 브라우저 확대 100% · 시크릿 모드 권장 (확장 프로그램 영향 X)
2. **준비 화면**: 메뉴 위치 보여줄 때는 마우스 커서 메뉴 위에 (cmd+shift+4 macOS · win+shift+s Windows)
3. **클릭 직후**: 다이얼로그·드롭다운 열린 상태 캡처
4. **결과 화면**: 생성 완료 후 결과물 보여주기

### 캡처 도구
| OS | 도구 | 단축키 |
|---|---|---|
| macOS | 기본 스크린샷 | `Cmd+Shift+4` (영역) · `Cmd+Shift+5` (옵션) |
| Windows | Snipping Tool · ShareX | `Win+Shift+S` |
| 모바일 (iOS) | 기본 | 사이드 + 볼륨업 동시 |
| 모바일 (Android) | 기본 | 전원 + 볼륨다운 동시 |

### 강조 박스·화살표 추가 (선택)
- **Skitch** (macOS·Win 무료): 빨간 박스·화살표·번호 추가 쉬움
- **Cleanshot X** (macOS 유료): 텍스트 캡션·블러 통합
- **ShareX** (Windows 무료): 자동 흐림·번호·화살표

추가 시 색상 권장:
- 빨강 박스: 핵심 메뉴 강조 (디자인 토큰 외 색상이지만 캡처는 예외)
- 초록 화살표: 클릭 순서
- 노랑 흐림: 민감정보 마스킹

---

## 6. 노션 업로드 시 자동 변환

`.claude/scripts/upload-to-notion.mjs`는 마크다운 `![]()` 이미지 임베드를 노션 image 블록으로 자동 변환 (`@tryfabric/martian` 처리).

### 주의
- 상대경로(`./screenshots/01-step-3.png`)는 노션에 업로드되지 않음 → **절대 URL 또는 GitHub Raw URL 변환 필수**
- 노션 업로드 전 GitHub Pages 또는 Raw URL로 변환:
  ```
  ./screenshots/01-step-3.png
  → https://raw.githubusercontent.com/parkchaorm-create/higgsfield-fullcourse-ppt/main/output/01강_힉스필드_첫만남/실습_튜토리얼/screenshots/01-step-3.png
  ```
- `upload-to-notion.mjs`에 `--screenshot-base-url <URL>` 옵션 추가 권장 (P3에서 구현)

---

## 7. 강사용 큐시트 (강사매뉴얼/)

강사가 라이브 또는 녹화 강의 시 화면 위치 빠른 참조용. 튜토리얼 스크린샷 그대로 재사용 가능.

```
output/<NN>강_<주제>/
└── 강사매뉴얼/
    └── 큐시트.md  ← 스크린샷 + 진행 멘트 + 시간 분배
```

---

## 절대 금지

- ❌ PPT HTML 안 스크린샷 임베드 (0건 의무)
- ❌ 한글 파일명 (`회원가입.png`)
- ❌ 민감정보 마스킹 누락 (이메일·이름·카드)
- ❌ WebP·GIF 형식
- ❌ 1MB 이상 단일 파일 (압축 의무)
- ❌ 인터페이스 가이드(`higgsfield-interface-2026-05-02.md`)와 다른 메뉴 배치를 캡처에서 보여주기

---

## 6개월 갱신 의무

Higgsfield UI는 빠르게 변경. 6개월 이상 경과한 스크린샷은 갱신:
1. 사용자가 새 캡처 공유
2. 인터페이스 가이드 새 날짜 작성
3. 본 정책 따라 회차별 스크린샷 재캡처
4. `_design/reference-lock.json` 갱신

---

## 참조

- `lecture.config.json` audience.tone_principles 4항 — 본 정책 근거
- `content-policy.md` 가-4 — 스크린샷 적극 활용 박제
- `audience-tone-checklist.md` TONE-4A·4B·4C — 자동·수동 검증 룰
- `regression-briefing.md` Case 8 — 임의 추측 메뉴 위치 회귀 사례
- `_design/tool-live-higgsfield-2026-05-02.md` — 도구 baseline
- `starter/input/materials/higgsfield-reference/higgsfield-interface-2026-05-02.md` — 인터페이스 SSOT (절대 우위)
- 1번 강의 `tutorial-screenshot-requirement.md` v2 — 본 강의가 예외 적용 박제하는 base 정책

## 개정 이력
- 2026-05-02 · v1.0 · 신설 (1번 강의 v2 정책 예외 적용 박제 · 왕왕초보 GUI 학습용)
