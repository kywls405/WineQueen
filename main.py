from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import threading
import json
import time

app = FastAPI()

# CORS 허용 설정 (React 연결 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 시엔 도메인 제한 권장
    allow_methods=["*"],
    allow_headers=["*"],
)

# YOLO 모델 로드
model = YOLO("yolov8n.pt")  # 경량 모델, 필요 시 yolov8s.pt도 가능

# 비디오 캡처 (본인 카메라 번호로 수정)
cap = cv2.VideoCapture(16)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 연결된 클라이언트 리스트
clients = []

def detection_loop():
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        # YOLO 추론
        results = model(frame, verbose=False)[0]
        detections = []

        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detections.append({
                "x": x1,
                "y": y1,
                "w": x2 - x1,
                "h": y2 - y1,
                "conf": conf,
                "class_id": class_id,
                "class_name": class_name
            })

        message = json.dumps({
            "timestamp": time.time(),
            "detections": detections
        })

        # WebSocket으로 전송
        for ws in clients[:]:
            try:
                ws.send_text(message)
            except:
                clients.remove(ws)

        time.sleep(0.05)  # 20 FPS 제한

@app.on_event("startup")
def start_thread():
    thread = threading.Thread(target=detection_loop)
    thread.daemon = True
    thread.start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # ping 유지용
    except:
        clients.remove(websocket)
