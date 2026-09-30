import { IncomingMessage, ServerResponse  } from "http";
import { sendResponse } from '../utils/serverResponse.js'

export function verifyLogin(req: IncomingMessage, res: ServerResponse): boolean {
    const islogged = req.headers["islogged"];
    
    if (islogged == null) {
        sendResponse(res, 403, "El usuario no tiene sesión iniciada");
    } else if(islogged == "1") 
        return true;
    else {
        sendResponse(res, 403, "Se ha detectado un valor inválido en el encabezado islogged");     
    }

    return false;
}
