import fs from 'fs';
import { cliente, clientes} from '../interfaces/cliente.js';
import { IncomingMessage, ServerResponse  } from "http";
import { sendResponse } from '../utils/serverResponse.js'

export function tareaBloqueante(req: IncomingMessage, res: ServerResponse) {
		res.write("Bloqueante: Primero lee el archivo antes de hacer la tarea dos\n");
		res.write("\nTarea uno\n");
		res.write("\nLeyendo el contenido del archivo");
    	const data = fs.readFileSync('src/test/test.txt', 'utf8');
    	res.write(`\n\nContenido del archivo:\n${data}`, 'utf8');
   		res.end("\nTarea dos");
}

export function tareaNoBloqueante(req: IncomingMessage, res: ServerResponse) {
		res.write("No bloqueante: No espera a que se termina de leer el archivo para empezar la tarea dos\n");
		res.write("\nTarea uno");
		res.write("\nLeyendo el contenido del archivo");
		fs.readFile('src/test/test.txt', 'utf8', (err, data) => {
			if (err) {
	        		console.error("Error leyendo archivo");
			    	return;
			}
			res.end(`\n\nContenido del archivo:\n${data}`, 'utf8')
		});
   		res.write("\nTarea dos");
}

export function getClients(req: IncomingMessage, res: ServerResponse) {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(clientes));
}


export function newClient(req: IncomingMessage, res: ServerResponse) {
	let rawData = '';
	let code = 201;
	let msg = '';
	let found = false;
	
	req.on('data', (chunk: String) => { rawData += chunk; });
	
	req.on('end', () => {
		try {
			let cliente1: cliente = JSON.parse(rawData);
			let { edad, nombre, apellido, id } = cliente1

			if (isNaN(edad) || isNaN(id)) {
				msg = "Se ha detectado un número inválido";
				code = 400;
			} else if (isEmptyStr(String(edad)) || isEmptyStr(apellido) || isEmptyStr(nombre) || isEmptyStr(String(id))) {
				msg = "Se ha detectado un campo vacío";
				code = 400;
			} else {
				cliente1.edad = Number(cliente1.edad);
				cliente1.id = Number(cliente1.id);

				// probablemente es vulnerable a condicion de carrera pero no importa solo es un ejemplo
				clientes.forEach(data => {
					if (id == data.id) {
						msg = "Se ha detectado que ya existe un cliente con ese ID";
						code = 409;
						found = true;
					}
				});

				if (!found) {
					clientes.push(cliente1);
					msg = "Se ha agregado correctamente el cliente";
				}
			}

			sendResponse(res, code, msg);

		} catch (_e) {
   			let result = (_e as Error).message;
			console.log(result);
			sendResponse(res, 500, result);
		}
	});
}

export function modifyClient(req: IncomingMessage, res: ServerResponse) {
	let rawData = '';
	let msg = '';
	let code = 200
	
	req.on('data', (chunk: String) => { rawData += chunk; });
	
	req.on('end', () => {
		try {
			let cliente1: cliente = JSON.parse(rawData);

			let { edad, nombre, apellido, id } = cliente1

			if (isNaN(edad) || isNaN(id)) {
				msg = "Se ha detectado un número inválido";
				code = 400;
			} else if (isEmptyStr(String(edad)) || isEmptyStr(apellido) || isEmptyStr(nombre) || isEmptyStr(String(id))) {
				msg = "Se ha detectado un campo vacío";
				code = 400;
			} else {
				msg = "No se ha encontrado el cliente";
				code = 404;
				cliente1.edad = Number(cliente1.edad);
				cliente1.id = Number(cliente1.id);

				clientes.forEach(data => {
					if (id == data.id) {
						data.nombre = nombre;
						data.apellido = apellido;
						data.edad = edad;
						msg = "Se ha modificado correctamente el cliente";
						code = 200;
					}
				});
			}

			sendResponse(res, code, msg);

		} catch (_e) {
   			let result = (_e as Error).message;
			console.log(result);
			sendResponse(res, 500, result);
		}
	});
}

export function deleteClient(req: IncomingMessage, res: ServerResponse) {
	let rawData = '';
	let msg = '';
	let code = 200;
	
	req.on('data', (chunk: String) => { rawData += chunk; });
	
	req.on('end', () => {
		try {
			let cliente1: cliente = JSON.parse(rawData);

			let { id } = cliente1

			if (isNaN(id)) {
				msg = "Se ha detectado un número inválido";
				code = 400;
			} else if (isEmptyStr(String(id))) {
				msg = "Se ha detectado un campo vacío";
				code = 400;
			} else {
				msg = "No se ha encontrado el cliente";
				code = 404;

				clientes.forEach(data => {
					if (id == data.id) {
						let index = clientes.indexOf(data, 0);
						clientes.splice(index,1);
						msg = "Se ha eliminado al cliente correctamente";
						code = 200;
					}
				});
			}

			sendResponse(res, code, msg);

		} catch (_e) {
   			let result = (_e as Error).message;
			console.log(result);
			sendResponse(res, 500, result);
		}
	});
}


function isEmptyStr(cadena: String) {
	if (cadena == null) return true;
	if (cadena.trim() == "") return true; else return false;
}

