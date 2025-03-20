const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const userRouter = require ("./routes/user.router")

const app = express();

app.engine('handlebars', handlebars.engine());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter)



app.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
});