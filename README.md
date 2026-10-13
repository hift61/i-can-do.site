# CanWeStar project website

한국어 CanSat 프로젝트 소개 사이트. GitHub Pages용 정적 HTML/CSS/JavaScript이며 별도 빌드가 필요 없습니다.

## 미리보기

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8765`를 엽니다.

## 파일

- `index.html`: 프로젝트 미션, 비행용 시스템, 지도 탐색, 진행 상태
- `styles.css`: 데스크톱·모바일 반응형 스타일
- `script.js`: 환경 변수 선택과 개념 시각화
- `assets/atmosphere-demo.html`: 프로젝트에서 생성한 Plotly 3D IDW 지도 (가상 데이터)
- `CNAME`: 기존 사용자 도메인 설정

## 콘텐츠 기준

CanWeStar 작업 폴더의 README, 비행 펌웨어 사양, 지상국 문서, 연구 구성안 및 수신 아카이브를 기반으로 작성했습니다. 수신 아카이브 통계는 2026-10-13 집계입니다. 개념 시각화와 실제 IDW 데모 모두 실측 대기 복원 성능을 입증하는 자료가 아닙니다. 펌웨어 검증 상태는 저장된 검증 보고서 기준입니다.

사이트의 Canvas는 환경 분포를 설명하는 개념도입니다. 과학적 보간 결과는 가상 낙하 데이터를 이용한 별도 Plotly 데모에서 확인할 수 있습니다. 가스 저항값은 VOC 농도(ppm)로 해석하지 않습니다.

원본 수신 JSONL, 실측 사진, 위치 기록, 하드웨어 주소 및 펌웨어 바이너리는 이 저장소에 포함하지 않습니다.

Noto Sans KR / IBM Plex Mono는 Google Fonts에서 불러오며 연결할 수 없으면 시스템 글꼴을 사용합니다. 3D 데모에는 Plotly 런타임이 포함되어 있습니다.
