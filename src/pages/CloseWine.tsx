import styles from "../styles/Wine.module.css";
import { useNavigate } from "react-router-dom";

const CloseWine = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/main");
  };
  return (
    <>
      <div className={styles.header}>뚜껑 닫는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img src="http://raspberrypi.local:8000/stream" alt="Live Stream" />
        </div>
        <div className={styles.sensor}>압력센서 값</div>
        <button onClick={onClick}>돌아가기</button>
      </div>
    </>
  );
};

export default CloseWine;
