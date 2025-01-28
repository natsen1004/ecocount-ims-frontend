import { io } from 'socket.io-client';

const socket = io("https://ecocount-ims-backend.onrender.com");

socket.on("connect", () => {
  console.log("Connected to Socket.io server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io server");
});

export default socket;
