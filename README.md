# 왕초보를 위한 힉스필드 A to Z 풀코스

> **부제**: 실전 예제로 SNS 콘텐츠·마케팅자료 만들기 풀코스

| 항목 | 값 |
|---|---|
| 도구 | Higgsfield AI (영상·이미지 생성) |
| 회차 | 20회 × 30분 = 총 10시간 |
| 대상 | 왕왕초보 (컴퓨터·영어 둘 다 익숙하지 않음) |
| 결과물 | 인스타 릴스·틱톡·유튜브 쇼츠·페북·X·마케팅 광고 영상 |
| 운영 | 유튜브 풀코스 롱폼 + 노션 자료실 + GitHub Pages |
| 브랜드 | PajamaBoss |

## 빠른 링크

- **GitHub Pages**: https://parkchaorm-create.github.io/higgsfield-fullcourse-ppt
- **노션 자료실**: https://www.notion.so/354a2ad9cef080f9877ff0adc2f2a09a
- **starter 도구**: `~/dev/강의/lecture- claudecode/`

## 폴더 구조

```
힉스필드 풀코스/
├── lecture.config.json    # 강의 SSOT (회차·brand·deploy·notion)
├── input/                 # 사용자 입력 (기획안·커리큘럼·스크립트)
│   ├── 강의기획안.md
│   ├── 커리큘럼.md
│   ├── reference-ppt/     # 1번 강의 reference 재사용
│   ├── materials/         # 참고 자료 (gitignore)
│   └── script/script_parts/  # 회차별 대본 (part-NN.md)
├── output/                # 자동 생성 (배포 대상)
│   ├── index.html         # 수강생 인덱스
│   ├── teacher.html       # 강사용 (노트 포함)
│   └── NN강_*/PPT/        # 회차별 PPT + 실습 + 갤러리
├── _design/               # Phase 0 사전 설계 산출물
│   ├── tool-live-higgsfield-YYYY-MM-DD.md   # 도구 학습 (T1·T2·T3)
│   ├── deck-outline.md
│   ├── 비유사전.md
│   └── 메뉴풀이사전.md
├── _skill-state/          # lecture-kit 진행 상태
│   └── state.json
└── scripts/               # 강의 전용 자동화
    ├── research-baseline.mjs   # T1·T2·T3 딥리서치
    ├── tone-lint.mjs           # 왕왕초보 톤 검증
    └── generate-gallery.mjs    # Higgsfield MCP 결과물 박제
```

## 다음 단계 (현재 진행 상황)

1. ✅ P0 SETUP — 강의 폴더 골격 + git init + first push
2. ⏳ P1 RESEARCH BASELINE — 딥리서치 1차 (T1·T2·T3)
3. ⏳ P2 CURRICULUM — 6라운드 Q&A로 20회 목차 결정
4. ⏳ P3 PPT 사전 설계 — 8종 산출물
5. ⏳ P4 회차별 콘텐츠 생성 (5회차씩 batch×4)
6. ⏳ P5 결과물 갤러리 (Higgsfield MCP)
7. ⏳ P6 QA 통합 검증
8. ⏳ P7 배포 (GitHub Pages + 노션)
9. ⏳ P8 CRON 운영 (주 1회 변경 감지)

## 운영 명령

```bash
# starter 도구를 통해 호출 (--lecture-dir로 강의 폴더 지정)
cd ~/dev/강의/lecture-\ claudecode

# 회차 단위 push
node .claude/scripts/publish-deck.mjs NN --lecture-dir ~/dev/강의/lectures/힉스필드\ 풀코스

# 노션 일괄 업로드
node .claude/scripts/upload-to-notion.mjs --lecture-dir ~/dev/강의/lectures/힉스필드\ 풀코스 \
  ~/dev/강의/lectures/힉스필드\ 풀코스/output/*/실습_튜토리얼/*.md --replace
```

## 참조

- **Plan**: `~/.claude/plans/sprightly-honking-wombat.md` (8 Phase 실행 플랜)
- **starter SSOT**: `~/dev/강의/lecture- claudecode/CLAUDE.md`
- **brand**: `~/dev/강의/brands/pajamaboss/`

---

© PajamaBoss · 2026
