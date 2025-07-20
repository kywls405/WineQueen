from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import cv2
import threading
import json
import time
import os

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# YOLO 모델 로드
model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(8)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

clients = []

# YOLO 감지 루프
def detection_loop():
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        results = model(frame, verbose=False)[0]
        detections = []

        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detections.append({
                "x": x1, "y": y1, "w": x2 - x1, "h": y2 - y1,
                "conf": conf, "class_id": class_id, "class_name": class_name
            })

        msg = json.dumps({
            "timestamp": time.time(),
            "detections": detections
        })

        for ws in clients[:]:
            try:
                ws.send_text(msg)
            except:
                clients.remove(ws)

        time.sleep(0.05)

@app.on_event("startup")
def on_startup():
    thread = threading.Thread(target=detection_loop, daemon=True)
    thread.start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keepalive 용도
    except:
        clients.remove(websocket)

@app.get("/video_feed")
def video_feed():
    def generate():
        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            # YOLO 추론 수행
            results = model(frame, verbose=False)[0]

            for box in results.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                class_id = int(box.cls[0])
                label = model.names[class_id]

                # Bounding box 그리기
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

            # JPEG 인코딩 후 전송
            _, buffer = cv2.imencode('.jpg', frame)
            yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")

# ✅ React 정적 파일 서빙
app.mount("/static", StaticFiles(directory="../frontend/dist/assets"), name="static")

@app.get("/")
@app.get("/{full_path:path}")
async def serve_spa(full_path: str = ""):
    index_path = os.path.abspath("../frontend/dist/index.html")
    return FileResponse(index_path)
