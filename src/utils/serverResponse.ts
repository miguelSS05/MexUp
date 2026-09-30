import { ServerResponse  } from "http";
import { IResponse } from '../interfaces/cliente.js';

let response : IResponse = {
    msg: ""
};

// usado para enviar una respuesta al cliente usando una estructura específica
// encabezado application/json
// {"msg": aqui va el mensaje recibido}
// 

export function sendResponse(res: ServerResponse, code: Number, txt: String) {
        response.msg = txt;
        res.statusCode = Number(code);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
}