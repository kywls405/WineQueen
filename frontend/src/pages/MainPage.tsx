import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  // 로컬스토리지에서 값 불러오기
  useEffect(() => {
    setStartTime1(localStorage.getItem("startTime1"));
    setStartTime2(localStorage.getItem("startTime2"));
  }, []);

  const handleClick1 = () => {
    const now = new Date().toISOString();
    localStorage.setItem("staratTime1", now);
    setStartTime1(now);
    navigate("/open?wine=1");
  };

  const handleClick2 = () => {
    const now = new Date().toISOString();
    localStorage.setItem("startTime2", now);
    setStartTime2(now);
    navigate("/open?wine=2");
  };

  const handleReset1 = () => {
    localStorage.removeItem("startTime1");
    setStartTime1(null);
  };

  const handleReset2 = () => {
    localStorage.removeItem("startTime2");
    setStartTime2(null);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.header}>
        <div>
          <span style={{ color: "#FFDB58" }}>개봉/밀봉</span>
          <span style={{ color: "#FFF" }}>할</span>
          <span style={{ color: "#2C001E" }}>와인</span>
          <span style={{ color: "#FFF" }}>을</span>
        </div>
        <div>
          <span style={{ color: "#FFF" }}>선택해 주세요</span>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.section}>
          <div onClick={handleClick1} className={styles.rectangle}>
            <img src={Wine_1} alt="와인1" />
          </div>
          <div className={styles.data}>
            {startTime1 && <div>최근 밀봉 일시</div>}
            <div>{formatDate(startTime1)}</div>
            <button onClick={handleReset1} className={styles.button}>
              날짜 초기화
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div onClick={handleClick2} className={styles.rectangle}>
            <img src={Wine_2} alt="와인2" />
          </div>
          <div className={styles.data}>
            {startTime2 && <div>최근 밀봉 일시</div>}
            <div>{formatDate(startTime2)}</div>
            <button onClick={handleReset2} className={styles.button}>
              날짜 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
