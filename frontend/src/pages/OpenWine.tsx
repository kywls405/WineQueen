import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/Wine.module.css";

const OpenWine = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.240.97:8000/ws");

    socket.onopen = () => {
      console.log("✅ WebSocket 연결됨");
      socket.send("ping");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 YOLO 데이터 수신:", data);
      // 👉 나중에 canvas로 바운딩박스 시각화에 활용
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 연결 종료");
    };

    return () => {
      socket.close();
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
            src="http://192.168.240.97:8000/video_feed"
            alt="Live Stream"
            className={styles.rectangle_img}
          />
        </div>
        <div className={styles.sensor}>추가예정</div>
        <button onClick={onClick}>돌아가기</button>
      </div>
    </>
  );
};

export default OpenWine;
