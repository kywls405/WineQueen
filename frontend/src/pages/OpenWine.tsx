import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/Wine.module.css";
import { NetWorkIp } from "../constants/constants";
import chevron from "../assets/chevron.svg";

const OpenWine = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 쿼리 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
  const wineNumber = queryParams.get("wine") || "0"; // 기본값은 0

  useEffect(() => {
    const socket = new WebSocket("ws://" + NetWorkIp + "/ws");

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 5000);

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
    <div className={styles.wrapper}>
      <div className={styles.goback}>
        <img onClick={onClick} src={chevron} alt="뒤로가기" />
      </div>
      <div className={styles.header}>{wineNumber}번 와인 개봉</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img
            src={"http://" + NetWorkIp + "/video_feed"}
            alt="Yolo Stream"
            className={styles.rectangle_img}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  );
};

export default OpenWine;
