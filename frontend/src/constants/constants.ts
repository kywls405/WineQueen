const configuredOrigin = import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/$/, "");

const getApiOrigin = () => configuredOrigin || window.location.origin;

export const getHttpUrl = (path: string) =>
  new URL(path, `${getApiOrigin()}/`).toString();

export const getWebSocketUrl = (path: string) => {
  const url = new URL(path, `${getApiOrigin()}/`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};
