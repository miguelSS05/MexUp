import { getClients, modifyClient, newClient, deleteClient, tareaBloqueante, tareaNoBloqueante } from '../controller/index.js'
import { IncomingMessage, ServerResponse  } from "http";
import { verifyLogin } from '../middleware/auth.middleware.js'
import { sendResponse } from '../utils/serverResponse.js'
import url from 'url';

export function router(req: IncomingMessage, res: ServerResponse)  {
    const req_url = url.parse(String(req.url), true);
    const ruta = req_url.pathname;
	const { method } = req;

    if (method == 'GET') {
        if (ruta == '/clientes') { if (!verifyLogin(req, res)) return; getClients(req, res) }
        else if (ruta == '/bloqueante') tareaBloqueante(req, res)
        else if (ruta == '/no-bloqueante') tareaNoBloqueante(req, res)
        else { sendResponse(res, 404, "Ruta inválida"); }
        //if (ruta == 'productos') //getProductos
	} else if (method == 'POST') {
        if (ruta == '/clientes') { if (!verifyLogin(req, res)) return; newClient(req, res) }
        else { sendResponse(res, 404, "Ruta inválida"); }
        //if (ruta == 'productos') //getProductos	
	} else if (method == 'PUT') {
        if (ruta == '/clientes') { if (!verifyLogin(req, res)) return; modifyClient(req, res) }
        else { sendResponse(res, 404, "Ruta inválida"); }
        //if (ruta == 'productos') //getProductos		
	} else if (method == 'DELETE') {
        if (ruta == '/clientes') { if (!verifyLogin(req, res)) return; deleteClient(req, res) }
        else { sendResponse(res, 404, "Ruta inválida"); }
        //if (ruta == 'productos') //getProductos		
	} else { sendResponse(res, 405, "Método inválido"); }
}