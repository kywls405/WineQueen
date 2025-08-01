import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPage.module.css";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/main");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div>
      <div className={`${styles.splash} ${styles.header}`}>🍷WineQueen🍷</div>
    </div>
  );
};

export default Splash;
