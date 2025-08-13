import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "../styles/MainPage.module.css";
import Wine_1 from "../assets/Wine_1.svg";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "밀봉 기록 없음";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "밀봉 기록 없음"
    : `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const MainPage = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setStorage = (value: string | null) => {
    if (value) localStorage.setItem("startTime", value);
    else localStorage.removeItem("startTime");
  };

  const handleOpen = () => navigate("/open?wine=1");

  const handleClose = () => {
    const now = new Date().toISOString();
    setStartTime(now);
    setStorage(now);
    navigate("/close?wine=1");
  };

  const handleReset = () => {
    setStartTime(null);
    setStorage(null);
  };

  const buttonActions = [handleOpen, handleClose, handleReset];

  // 초기값 로드
  useEffect(() => {
    setStartTime(localStorage.getItem("startTime"));
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setFocusedIndex((prev) => (prev + 1) % buttonActions.length);
      } else if (e.key === "ArrowLeft") {
        setFocusedIndex(
          (prev) => (prev - 1 + buttonActions.length) % buttonActions.length
        );
      } else if (e.key === "Enter") {
        buttonActions[focusedIndex]?.();
      }
    },
    [focusedIndex, buttonActions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    buttonRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.header}>
        <div>
          <span style={{ color: "#FFDB58" }}>개봉/밀봉</span>
          <span style={{ color: "#FFF" }}>할</span>
          <span style={{ color: "#2C001E" }}> 와인</span>
          <span style={{ color: "#FFF" }}>을</span>
        </div>
        <div>
          <span style={{ color: "#FFF" }}>선택해 주세요</span>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.section}>
          <div>
            <button
              ref={(el) => (buttonRefs.current[0] = el)}
              className={styles.button}
              onClick={handleOpen}
            >
              개봉
            </button>
            <button
              ref={(el) => (buttonRefs.current[1] = el)}
              className={styles.button}
              onClick={handleClose}
            >
              밀봉
            </button>
          </div>

          <div className={styles.rectangle}>
            <img src={Wine_1} alt="와인1" />
          </div>

          <div className={styles.data}>
            {startTime && <div>최근 밀봉 일시</div>}
            <div>{formatDate(startTime)}</div>
            <button
              ref={(el) => (buttonRefs.current[2] = el)}
              className={styles.button}
              onClick={handleReset}
            >
              날짜 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
