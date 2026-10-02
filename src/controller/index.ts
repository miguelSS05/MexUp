import autocannon from 'autocannon'
import fs, { EncodingOption } from 'fs';
import { cliente, clientes } from '../interfaces/cliente.js';
import { IncomingMessage, ServerResponse  } from "http";
import { sendResponse } from '../utils/serverResponse.js'
import { Transform, Writable, Readable } from 'stream';
import { CallbackFunction } from 'node:ffi';
import { pipeline } from 'stream/promises';
import { once } from 'events';

class MayusculasTransform extends Transform {
  _transform(chunk: String, encoding: EncodingOption, callback: CallbackFunction) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}


// https://dev.to/ayako_yk/understanding-streams-in-nodejs-from-piping-to-backpressure-1ncf
// https://programacion.net/articulo/streams-en-node-js-readable-writable-transform-y-pipeline-para-i-o-eficiente_4249
export async function StreamBackpressureTest(req: IncomingMessage, res: ServerResponse) {
	const ReadStream = fs.createReadStream('src/utils/source.txt', { encoding: 'utf8', highWaterMark: 16 * 1024 }); // seleccionar tamaño del buffer (16kb)
	const WriteStream = fs.createWriteStream('src/utils/destination.txt', { encoding: 'utf8', highWaterMark: 16 * 1024 });

	let total = 0;
	for await (const fragmento of ReadStream) { // ReadStream - maneja la presión de vuelta (backpressure) (for ... await)
		const waitDrain = !WriteStream.write(fragmento); 
// When .write() returns false, a backpressure system takes effect. It pauses the flow of data from the readable stream and waits until the consumer is ready again. 
		if (waitDrain) { 
			console.log('>> wait drain'); 
			await once(WriteStream, 'drain'); 
		} 
		total += fragmento.length;
		process.stdout.write('.'); // indicador de progreso
	}

	console.log(`Leídos: ${total} caracteres`);
	res.end();
}


export async function StreamPipelineTest(req: IncomingMessage, res: ServerResponse)  {
	// Crear flujo de lectura y escritura
	const readableStream = fs.createReadStream("src/utils/source.txt", { encoding: 'utf8', highWaterMark: 1 * 1024 });
	const writableStream = fs.createWriteStream("src/utils/destination.txt", { encoding: 'utf8', highWaterMark: 1 * 1024 });

	await pipeline(
		readableStream, 
		new MayusculasTransform(), // transformador
		writableStream
	);

	// manejar erroes
	readableStream.on('error', (err: Error) => {
	console.error('Error de lectura:', err);
	});

	writableStream.on('error', (err: Error) => {
	console.error('Error de escritura:', err);
	});

	writableStream.on('finish', () => {
	console.log('El archivo ha sido copiado exitosamente');
	}); 

	res.end();
}

export async function TestAutocannon(req: IncomingMessage, res: ServerResponse) {
    const  testNum = req.headers["test"];
    
    if (testNum == null) {
        sendResponse(res, 403, "No se ha elegido un test válido (1, 2 o 3)");
    } else if(testNum == "1")  {
		const instance = autocannon({
			title: "AUTOCANNON TEST",
			url: "http://localhost:3000",
			connections: 10,
			duration: 10,
			pipelining: 1,
			workers: 2,
			requests: [
				{
					method:"GET",
					path:"/clientes",
					headers: {
						'islogged' : '1'
					}
				}
			]
		},console.log);
		sendResponse(res, 200, "Ejecutando test 1, esperar resultado en consola");  
    } else if(testNum == "2")  {
		const instance = autocannon({
			title: "AUTOCANNON TEST",
			url: "http://localhost:3000",
			connections: 10,
			duration: 10,
			pipelining: 1,
			workers: 2,
			requests: [
				{
					method:"POST",
					path:"/clientes",
					headers: {
						'islogged' : '1',
						'Content-Type': 'application/sjon'
					},
					body: JSON.stringify({
						id: 99,
						nombre: "nombre1",
						apellido: "nombre2",
						edad: 99
					})
				}
			]
		},console.log);
        sendResponse(res, 200, "Ejecutando test 2, esperar resultado en consola");  
    }else if(testNum == "3")  {
		const instance = autocannon({
			title: "AUTOCANNON TEST",
			url: "http://localhost:3000",
			connections: 10,
			duration: 10,
			pipelining: 1,
			workers: 2,
			requests: [
				{
					method:"DELETE",
					path:"/clientes",
					headers: {
						'islogged' : '1',
						'Content-Type': 'application/sjon'
					},
					body: JSON.stringify({
						id: 99
					})
				}
			]
		},console.log);
        sendResponse(res, 200, "Ejecutando test 3, esperar resultado en consola");     
    }  else {
        sendResponse(res, 403, "Se ha detectado un valor inválido en el encabezado test");     
    }
}

export function tareaBloqueante(req: IncomingMessage, res: ServerResponse) {
		res.write("Bloqueante: Primero lee el archivo antes de hacer la tarea dos\n");
		res.write("\nTarea uno\n");
		res.write("\nLeyendo el contenido del archivo");
    	const data = fs.readFileSync('src/utils/test.txt', 'utf8');
    	res.write(`\n\nContenido del archivo:\n${data}`, 'utf8');
   		res.end("\nTarea dos");
}

export function tareaNoBloqueante(req: IncomingMessage, res: ServerResponse) {
		res.write("No bloqueante: No espera a que se termina de leer el archivo para empezar la tarea dos\n");
		res.write("\nTarea uno");
		res.write("\nLeyendo el contenido del archivo");
		fs.readFile('src/utils/test.txt', 'utf8', (err, data) => {
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

