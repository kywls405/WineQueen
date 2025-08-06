프론트엔드 배포 링크: https://wine-queen-74pol4zkk-junseochois-projects.vercel.app/main
cd WineQueen/backend
uvicorn main:app --host 0.0.0.0 --port 8000

cd WineQueen
source venv/bin/activate

cd WineQueen/backend
uvicorn main:app --host 0.0.0.0 --port 8000

카메라 몇번인지 찾는법
v4l2-ctl --list-devices

/////////////////////////////////////////////////

✅ 전체 동작 구조 흐름
📦 1. 백엔드 준비 (backend/)
▶ 1-1. 가상환경 활성화 (Python)
bash
코드 복사
source venv/bin/activate
또는 conda activate 등 쓰는 가상환경에 따라 다름

▶ 1-2. FastAPI 서버 실행 (YOLO 포함)
bash
코드 복사
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
🔹 이로써 백엔드 API + /video_feed + /ws WebSocket 서버까지 켜짐

💻 2. 프론트엔드 실행 (frontend/)
▶ 2-1. 개발 서버 실행 (React + Vite)
bash
코드 복사
cd frontend
yarn dev --host
🔹 그러면 http://192.168.xx.xx:5173/ 주소에서 사이트 열림
🔹 사이트 내부에서 /video_feed, /ws로 백엔드와 통신함

🧭 요약 순서표
단계 실행 위치 명령어
1️⃣ ~/WineQueen/ source venv/bin/activate
2️⃣ ~/WineQueen/backend/ uvicorn main:app --host 0.0.0.0 --port 8000
3️⃣ ~/WineQueen/frontend/ yarn dev --host

💡 왜 이렇게 나누는가?
백엔드	프론트엔드
YOLOv8 실행, 비디오 스트리밍, WebSocket, 센서 처리	사용자 UI, React 상태 관리, 실시간 표시
FastAPI로 API/WS 응답 처리	Vite/React로 실시간 대시보드 표시
Python 환경 (venv)	Node.js 환경 (yarn/npm)

////////////////////////////////////////////////////////////////////////////
카메라

명령어
Bash
ls /dev/video*
결과 예시:

/dev/video0  /dev/video1

상세 정보 확인 (v4l2-utils 설치 필요)
명령어
Bash
v4l2-ctl --list-devices
결과 예시:ㄴ

HD Pro Webcam C920 (usb-0000:00:14.0-1):
        /dev/video0
        /dev/video1

Integrated Camera (usb-0000:00:1a.0-1.2):
        /dev/video2
        /dev/video3
해석: C920 웹캠이 video0과 video1에, 내장 카메라가 video2와 video3에 할당된 것을 명확히 알 수 있습니다.
