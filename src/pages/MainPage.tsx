import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import Wine_1 from "../assets/Wine_1.jpg";
import Wine_2 from "../assets/Wine_2.jpg";

// ⏱ 초를 00:00:00 형식으로 변환하는 함수
const formatTime = (seconds: number): string => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const MainPage = () => {
  const navigate = useNavigate();

  const [elapsed1, setElapsed1] = useState(0);
  const [elapsed2, setElapsed2] = useState(0);

  // 최초 시작 시간 저장 (localStorage)
  useEffect(() => {
    const now = Date.now();
    if (!localStorage.getItem("startTime1")) {
      localStorage.setItem("startTime1", now.toString());
    }
    if (!localStorage.getItem("startTime2")) {
      localStorage.setItem("startTime2", now.toString());
    }
  }, []);

  // 매초 경과 시간 계산
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const start1 = parseInt(
        localStorage.getItem("startTime1") || `${now}`,
        10
      );
      const start2 = parseInt(
        localStorage.getItem("startTime2") || `${now}`,
        10
      );
      setElapsed1(Math.floor((now - start1) / 1000));
      setElapsed2(Math.floor((now - start2) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (elapsed1 >= 300) {
      localStorage.removeItem("startTime1");
      navigate("/close");
    } else if (elapsed2 >= 300) {
      localStorage.removeItem("startTime2");
      navigate("/close");
    }
  }, [elapsed1, elapsed2, navigate]);

  const handleClickOpen = () => {
    navigate("/open");
  };

  return (
    <>
      <div className={styles.header}>🍷WineQueen🍷</div>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <div>{formatTime(elapsed1)}</div>
          <div onClick={handleClickOpen} className={styles.rectangle}>
            <img src={Wine_1} alt="와인1" />
            <div>1</div>
          </div>
        </div>
        <div className={styles.section}>
          <div>{formatTime(elapsed2)}</div>
          <div onClick={handleClickOpen} className={styles.rectangle}>
            <img src={Wine_2} alt="와인2" />
            <div>2</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
