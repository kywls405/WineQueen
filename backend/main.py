from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import cv2
import threading
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React 프론트에서 접근 가능
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")  # 모델 경로
cap = cv2.VideoCapture(0)   # 필요시 번호 수정

clients = []

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

        msg = json.dumps({"timestamp": time.time(), "detections": detections})

        for ws in clients[:]:
            try:
                ws.send_text(msg)
            except:
                clients.remove(ws)

        time.sleep(0.05)  # 20fps

@app.on_event("startup")
def startup_event():
    threading.Thread(target=detection_loop, daemon=True).start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)

@app.get("/video_feed")
def video_feed():
    def gen_frames():
        while True:
            ret, frame = cap.read()
            if not ret:
                continue
            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    return StreamingResponse(gen_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
