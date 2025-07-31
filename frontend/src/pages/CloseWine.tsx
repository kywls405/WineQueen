import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/Wine.module.css";

const CloseWine = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.214.97:8000/ws");

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 5000); // 5초 간격 ping

    socket.onopen = () => {
      console.log("✅ WebSocket 연결됨 (CloseWine)");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 수신된 데이터 (CloseWine):", data);
        // TODO: 압력센서 상태 업데이트 구현 예정
      } catch (e) {
        console.error("❗ JSON 파싱 오류 (CloseWine):", e);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 연결 종료 (CloseWine)");
      clearInterval(pingInterval);
    };

    return () => {
      socket.close();
      clearInterval(pingInterval);
    };
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>뚜껑 닫는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img
            src="http://192.168.214.97:8000/video_feed"
            alt="Yolo Stream"
            className={styles.rectangle_img}
            crossOrigin="anonymous"
          />
        </div>
        <div className={styles.sensor}>압력센서 값 표시 예정</div>
        <button className={styles.backButton} onClick={handleBack}>
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default CloseWine;
