import axios from "axios";

const baseURL =
  process.env.REACT_APP_TMDB_API_BASE?.trim() || "https://api.themoviedb.org/3";

const apiKey = process.env.REACT_APP_TMDB_API_KEY?.trim();
const accessToken = process.env.REACT_APP_TMDB_ACCESS_TOKEN?.trim();

export const tmdbClient = axios.create({
  baseURL,
  timeout: 15000,
});

tmdbClient.interceptors.request.use((config) => {
  const next = { ...config };

  next.headers = next.headers || {};
  next.headers.Accept = "application/json";

  // language по умолчанию (интерфейс у нас английский)
  next.params = { ...(next.params || {}), language: "en-US" };

  // prefer Bearer token (works for v3 & v4)
  if (accessToken) {
    next.headers.Authorization = `Bearer ${accessToken}`;
  } else if (apiKey) {
    next.params.api_key = apiKey;
  } else {
    // чтобы сразу было видно причину, если забудешь env
    // eslint-disable-next-line no-console
    console.warn(
      "TMDb auth is missing. Set REACT_APP_TMDB_ACCESS_TOKEN or REACT_APP_TMDB_API_KEY."
    );
  }

  return next;
});
