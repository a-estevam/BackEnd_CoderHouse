const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const viewsRouter = require('./routes/views.router');
const { Server } = require('socket.io');
const http = require('http');

const Port = 8080;
const app = express();

// Configurações de parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do motor de views
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rota para as views
app.use('/', viewsRouter);

// Criação do servidor HTTP e inicialização do Socket.io
const server = http.createServer(app);
const httpServer = app.listen(Port, () => console.log(`servidor rodando na porta: ${Port}`));
const socketServer = new Server(httpServer);
