const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let usuariosConectados = {};

io.on('connection', (socket) => {
  console.log('Nueva Chromebook conectada:', socket.id);

  socket.on('registrar_usuario', (userData) => {
    usuariosConectados[socket.id] = { ...userData, socketId: socket.id };
    io.emit('lista_usuarios', Object.values(usuariosConectados));
  });

  socket.on('enviar_mensaje', (msgData) => {
    io.emit('nuevo_mensaje', msgData);
  });

  socket.on('disconnect', () => {
    delete usuariosConectados[socket.id];
    io.emit('lista_usuarios', Object.values(usuariosConectados));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor de SmartNotes corriendo en puerto ${PORT}`);
});
