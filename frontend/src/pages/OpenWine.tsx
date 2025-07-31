import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/Wine.module.css";

const OpenWine = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.214.97:8000/ws");

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 5000); // 5초 간격 ping

    socket.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 YOLO 데이터 수신:", data);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 연결 종료");
      clearInterval(pingInterval);
    };

    return () => {
      socket.close();
      clearInterval(pingInterval);
    };
  }, []);

  const onClick = () => {
    navigate("/main");
  };

  return (
    <>
      <div className={styles.header}>뚜껑 여는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img
            src="http://192.168.214.97:8000/video_feed"
            alt="Yolo Stream"
            className={styles.rectangle_img}
            crossOrigin="anonymous"
          />
        </div>
        <div className={styles.sensor}>추가예정</div>
        <button onClick={onClick}>돌아가기</button>
      </div>
    </>
  );
};

export default OpenWine;
