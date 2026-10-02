import { IncomingMessage, ServerResponse, createServer, Server } from "http";
import { router } from '../router/index.js';

export class HttpServer {
  public static server: Server;

  constructor() {
    const hostname = "127.0.0.1";
    const port = 3000;
    const server = createServer((req: IncomingMessage,res: ServerResponse) => {
 	    router(req,res);	
    });

  HttpServer.server = server.listen(port, hostname, () => {
console.log(`Server is running on port ${port} with pid = ${process.pid}`);
  });
  }

  public closeServer(): void {
    if (HttpServer.server) {
      console.log("Servidor cerrado tranquilamente");
      HttpServer.server.close
    }
  }
}
