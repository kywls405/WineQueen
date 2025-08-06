import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import Wine_1 from "../assets/Wine_1.svg";
import Wine_2 from "../assets/Wine_2.svg";

const MainPage = () => {
  const navigate = useNavigate();

  const handleClick1 = () => {
    localStorage.removeItem("startTime1");
    navigate("/open");
  };

  const handleClick2 = () => {
    localStorage.removeItem("startTime2");
    navigate("/open");
  };

  return (
    <>
      <div className={styles.header}>
        <span style={{ color: "#FFDB58" }}>개봉/밀봉</span>
        <span style={{ color: "#FFF" }}>할</span>
        <span style={{ color: "#FFDB58" }}>와인</span>
        <span style={{ color: "#FFDB58" }}>을</span>
        <div style={{ color: "#FFDB58" }}>선택해 주세요</div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <div onClick={handleClick1} className={styles.rectangle}>
            <img src={Wine_1} alt="와인1" />
          </div>
        </div>
        <div className={styles.section}>
          <div onClick={handleClick2} className={styles.rectangle}>
            <img src={Wine_2} alt="와인2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
