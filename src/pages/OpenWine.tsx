import { useNavigate } from "react-router-dom";
import styles from "../styles/Wine.module.css";

const OpenWine = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/main");
  };
  return (
    <>
      <div className={styles.header}>뚜껑 여는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img src="http://raspberrypi.local:8000/stream" alt="Live Stream" />
        </div>
        <div className={styles.sensor}>추가예정</div>
        <button onClick={onClick}>돌아가기</button>
      </div>
    </>
  );
};

export default OpenWine;
