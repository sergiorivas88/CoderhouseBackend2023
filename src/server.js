import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import config from './config/envConfig.js';
import { init } from './db/mongodb.js';

const server = http.createServer(app);

const PORT = config.port;

// Configuración del servidor de sockets
export const socketServer = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

// Manejadores de eventos de sockets
socketServer.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('new message', (message) => {
    socketServer.emit('new message', message);
  });
});

// Inicialización de la base de datos
await init();

// Inicio del servidor HTTP
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
