import * as http from 'http';
import * as fs from 'fs';
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req,res) => {
	const ruta = req.url
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	router(ruta, res);
});

function router(ruta, res) {
	if (ruta == '/bloqueante') {
		res.write("Bloqueante: Primero lee el archivo antes de hacer la tarea dos\n");
		res.write("\nTarea uno\n");
		res.write("\nLeyendo el contenido del archivo");
    		const data = fs.readFileSync('src/test/test.txt', 'utf8');
    		res.write(`\n\nContenido del archivo:\n${data}`, 'utf8');
   		res.end("\nTarea dos");
	} else if (ruta == '/no-bloqueante') {
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
	} else {
		res.end("Ruta invalida");
	}
}

server.listen(port, hostname, () => {
	console.log(`Servidor ejecutándose en http://${hostname}:${port}/`)
});
