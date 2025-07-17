import React from "react";
import styles from "../styles/MainPage.module.css";

const MainPage = () => {
  return (
    <>
      <div className={styles.header}>🍷WineQueen🍷</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>카메라</div>
        <div className={styles.sensor}>압력센서</div>
      </div>
    </>
  );
};

export default MainPage;
