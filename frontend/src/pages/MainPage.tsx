import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/MainPage.module.css";
import Wine_1 from "../assets/Wine_1.svg";
import Wine_2 from "../assets/Wine_2.svg";

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "밀봉 기록 없음";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "밀봉 기록 없음";

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const MainPage = () => {
  const navigate = useNavigate();

  const [startTime1, setStartTime1] = useState<string | null>(null);
  const [startTime2, setStartTime2] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 버튼별 동작 정의
  const buttonActions = [
    () => navigate("/open?wine=1"), // 0
    () => {
      const now = new Date().toISOString();
      localStorage.setItem("startTime1", now);
      setStartTime1(now);
      navigate("/close?wine=1");
    }, // 1
    () => {
      localStorage.removeItem("startTime1");
      setStartTime1(null);
    }, // 2
    () => navigate("/open?wine=2"), // 3
    () => {
      const now = new Date().toISOString();
      localStorage.setItem("startTime2", now);
      setStartTime2(now);
      navigate("/close?wine=2");
    }, // 4
    () => {
      localStorage.removeItem("startTime2");
      setStartTime2(null);
    }, // 5
  ];

  useEffect(() => {
    // 로컬스토리지에서 초기값 불러오기
    setStartTime1(localStorage.getItem("startTime1"));
    setStartTime2(localStorage.getItem("startTime2"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setFocusedIndex((prev) => (prev + 1) % buttonActions.length);
      } else if (e.key === "ArrowLeft") {
        setFocusedIndex(
          (prev) => (prev - 1 + buttonActions.length) % buttonActions.length
        );
      } else if (e.key === "Enter") {
        buttonActions[focusedIndex]?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex]);

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
        {/* 와인 1 */}
        <div className={styles.section}>
          <div>
            <button
              ref={(el) => (buttonRefs.current[0] = el)}
              className={styles.button}
            >
              개봉
            </button>
            <button
              ref={(el) => (buttonRefs.current[1] = el)}
              className={styles.button}
            >
              밀봉
            </button>
          </div>
          <div className={styles.rectangle}>
            <img src={Wine_1} alt="와인1" />
          </div>
          <div className={styles.data}>
            {startTime1 && <div>최근 밀봉 일시</div>}
            <div>{formatDate(startTime1)}</div>
            <button
              ref={(el) => (buttonRefs.current[2] = el)}
              className={styles.button}
            >
              날짜 초기화
            </button>
          </div>
        </div>

        {/* 와인 2 */}
        <div className={styles.section}>
          <div>
            <button
              ref={(el) => (buttonRefs.current[3] = el)}
              className={styles.button}
            >
              개봉
            </button>
            <button
              ref={(el) => (buttonRefs.current[4] = el)}
              className={styles.button}
            >
              밀봉
            </button>
          </div>
          <div className={styles.rectangle}>
            <img src={Wine_2} alt="와인2" />
          </div>
          <div className={styles.data}>
            {startTime2 && <div>최근 밀봉 일시</div>}
            <div>{formatDate(startTime2)}</div>
            <button
              ref={(el) => (buttonRefs.current[5] = el)}
              className={styles.button}
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
