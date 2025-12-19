import axios from "axios";

const baseURL =
  process.env.REACT_APP_IMDB_API_BASE?.trim() || "https://rest.imdbapi.dev/v2";

export const imdbClient = axios.create({
  baseURL,
  timeout: 15000,
});

console.log("IMDB baseURL:", baseURL);