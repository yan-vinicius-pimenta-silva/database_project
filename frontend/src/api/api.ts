// src/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5260" // replace with your backend port
});
