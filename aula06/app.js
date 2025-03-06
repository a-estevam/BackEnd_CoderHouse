const http = require ('http');

const server = http.createServer((request, response) =>{
    response.end("Meu primeiro servidor")
});

server.listen(8080, () =>{
    console.log('servidor na porta 8080')
});