from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from ultralytics import YOLO
import cv2
import threading
import json
import time
import os
import asyncio

# --- 전역 변수 및 설정 ---
# YOLO 모델 로드 (학습된 커스텀 모델)
model = YOLO("best.pt") 

# 카메라 설정 (인덱스는 환경에 맞게 조정)
try:
    cap = cv2.VideoCapture(8) 
    if not cap.isOpened():
        raise IOError("Cannot open webcam")
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
except Exception as e:
    print(f"❌ 카메라 초기화 실패: {e}")
    cap = None

# 클라이언트 및 데이터 공유를 위한 변수
clients = []
latest_annotated_frame = None
latest_detections_json = "{}"
frame_lock = threading.Lock()
detections_lock = threading.Lock()

# --- 객체 감지 및 데이터 처리 (백그라운드 스레드 - 생산자) ---
def detection_loop():
    global latest_annotated_frame, latest_detections_json, cap

    if cap is None:
        print("카메라가 없으므로 감지 루프를 시작할 수 없습니다.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("프레임 읽기 실패. 루프를 종료합니다.")
            break
        
        # 1. AI 추론 (여기서 딱 한 번만 실행)
        results = model(frame, verbose=False)[0]
        
        detections = []
        # 2. 결과 처리 및 화면 그리기
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            # 웹소켓으로 보낼 JSON 데이터 준비
            detections.append({
                "x": x1, "y": y1, "w": x2 - x1, "h": y2 - y1,
                "conf": conf, "class_id": class_id, "class_name": class_name
            })
            
            # 스트리밍 영상에 바운딩 박스 그리기
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name} {conf:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # 3. 처리된 결과물을 스레드 안전하게 전역 변수에 저장
        with detections_lock:
            latest_detections_json = json.dumps({
                "timestamp": time.time(),
                "detections": detections
            })

        with frame_lock:
            _, buffer = cv2.imencode('.jpg', frame)
            latest_annotated_frame = buffer.tobytes()

        time.sleep(0.03) # CPU 사용량 조절

    cap.release()

# --- 웹소켓 데이터 브로드캐스팅 (소비자) ---
async def broadcast_detections():
    while True:
        try:
            with detections_lock:
                detections_to_send = latest_detections_json
            
            # 비동기적으로 모든 클라이언트에게 메시지 전송
            await asyncio.gather(
                *[ws.send_text(detections_to_send) for ws in clients],
                return_exceptions=False
            )
        except Exception as e:
            print(f"브로드캐스팅 오류: {e}")

        await asyncio.sleep(0.1) # 0.1초마다 데이터 전송

# --- FastAPI Lifespan 및 라우트 설정 ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 서버 시작: 감지 스레드 및 브로드캐스터 시작...")
    detection_thread = threading.Thread(target=detection_loop, daemon=True)
    detection_thread.start()
    
    broadcast_task = asyncio.create_task(broadcast_detections())
    
    yield
    
    print("💤 서버 종료...")
    broadcast_task.cancel()
    if cap and cap.isOpened():
        cap.release()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    print(f"클라이언트 연결: {len(clients)}명 접속 중")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.remove(websocket)
        print(f"클라이언트 연결 끊김: {len(clients)}명 접속 중")

# MJPEG 영상 스트리밍 (소비자)
def generate_annotated_frame():
    while True:
        with frame_lock:
            if latest_annotated_frame is None:
                continue
            frame_bytes = latest_annotated_frame
        
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
        time.sleep(0.03)

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(generate_annotated_frame(), media_type="multipart/x-mixed-replace; boundary=frame")

# React 정적 파일 서빙
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="static")
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str = ""):
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not found"}
else:
    @app.get("/")
    def root():
        return {"message": "Backend is running, but frontend build is not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
