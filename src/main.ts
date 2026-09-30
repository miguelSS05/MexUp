import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { IncomingMessage, ServerResponse  } from "http";
import { router } from './router/index.js';

const http = require('http');
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req: IncomingMessage,res: ServerResponse) => {
	//res.statusCode = 200;
	//res.setHeader('Content-Type', 'text/plain');

 	router(req,res);	
});

server.listen(port, hostname, () => {
	console.log(`Servidor ejecutándose en http://${hostname}:${port}/`)
});
