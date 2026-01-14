import { io } from "socket.io-client";
import { API_BASE_URL } from "../utils/config";

const socket = io(API_BASE_URL, {
  autoConnect: false,
});

export default socket;
