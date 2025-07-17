import styles from "../styles/Wine.module.css";

const OpenWine = () => {
  return (
    <>
      <div className={styles.header}>뚜껑 여는 중...</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>카메라</div>
        <div className={styles.sensor}>추가예정</div>
      </div>
    </>
  );
};

export default OpenWine;
