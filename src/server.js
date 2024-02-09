import { init } from './db/mongodb.js';
import http from 'http';
import app from './app.js';
import config from './config/envConfig.js'
import { Server } from 'socket.io';

const server = http.createServer(app);

const PORT = config.port;


export const socketServer = new Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
        methods: ["GET", "POST"]
    }
});


socketServer.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('new message', (message) => {
        socketServer.emit('new message', message);
    });
});


await init();

server.listen(PORT, () => {
    console.log(`Server running into http://localhost:${PORT}`);
});
