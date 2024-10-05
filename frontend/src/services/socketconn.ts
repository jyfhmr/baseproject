'use client'
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_URL_IMAGE || 'si-lees-esto-la-variable-de-entorno-que-lee-el-socket-no-funciona', {
  transports: ['websocket'], // Fuerza el uso de WebSocket
  withCredentials: true,
  reconnection: true, // Habilita la reconexión automática
  reconnectionAttempts: Infinity, // Número de intentos de reconexión
});

console.log("URL",process.env.NEXT_PUBLIC_URL_IMAGE)


socket.on('connect', () => {
  console.log('Conexión establecida con el servidor de Socket.io');


  
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado del servidor de Socket.io:', reason);
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Intento de reconexión #${attempt}`);
});

export default socket;
