// app.js

const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

const Port = 8080;
const realTimeProductsRouter = require("./routes/realTimeProducts.router");
const indexRouter = require("./routes/index.router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const socketServer = new Server(server);


app.set("socketServer", socketServer);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/realTimeProducts", realTimeProductsRouter); 
app.use("/", indexRouter);

server.listen(Port, () => {
  console.log(`Servidor rodando na porta: ${Port}`);
});
