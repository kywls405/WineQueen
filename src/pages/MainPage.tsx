import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import Wine_1 from "../assets/Wine_1.jpg";
import Wine_2 from "../assets/Wine_2.jpg";

const MainPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/open");
  };

  return (
    <>
      <div className={styles.header}>🍷WineQueen🍷</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img src={Wine_1} alt="와인1" />
          <div onClick={handleClick}>❶</div>
        </div>
        <div className={styles.sensor}>
          <img src={Wine_2} alt="와인2" />
          <div onClick={handleClick}>❷</div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
