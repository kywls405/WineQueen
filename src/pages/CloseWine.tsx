import styles from "../styles/Wine.module.css";

const CloseWine = () => {
  return (
    <>
      <div className={styles.header}>뚜껑 닫는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>카메라</div>
        <div className={styles.sensor}>압력센서 값</div>
      </div>
    </>
  );
};

export default CloseWine;
