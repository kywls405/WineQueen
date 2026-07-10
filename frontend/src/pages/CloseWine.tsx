import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import styles from "../styles/Wine.module.css";
import { getHttpUrl, getWebSocketUrl } from "../constants/constants";
import { subscribeWS } from "../lib/ws";

const CloseWine = () => {
  const navigate = useNavigate();
  const firedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    navigate("/main");
  }, [navigate]);

  useEffect(() => {
    timerRef.current = window.setTimeout(finish, 30_000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [finish]);

  useEffect(() => {
    const unsubscribe = subscribeWS(getWebSocketUrl("/ws"), (event) => {
      let data: unknown = event.data;
      if (typeof data === "string") {
        const text = data.trim();
        if (text === "3") return finish();
        if (text === "ping" || text === "pong") return;
        try {
          data = JSON.parse(text);
        } catch {
          return;
        }
      }

      const message = data as { type?: string; value?: unknown };
      if (message?.type === "button" && Number(message.value) === 3) finish();
    });
    return unsubscribe;
  }, [finish]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "3" || event.code === "Numpad3") finish();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finish]);

  useEffect(() => {
    fetch(getHttpUrl("/control/seal"), { method: "POST" }).catch(() => {});
    return () => {
      fetch(getHttpUrl("/control/stop"), { method: "POST" }).catch(() => {});
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Seal the Wine</div>
      <div className={styles.section}>
        <div className={styles.rectangle}>
          <img
            src={getHttpUrl("/video_feed")}
            alt="Live bottle alignment"
            className={styles.rectangle_img}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  );
};

export default CloseWine;
