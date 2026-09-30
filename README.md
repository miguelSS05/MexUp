# MexUp

El propósito de este proyecto es desarrollar una aplicación de tienda de ropa teniendo en mente características de un software de calidad,
como que sea escalable, que pueda manejar múltiples
peticiones al mismo tiempo (concurrencia) y que guarde la información de sus clientes de manera segura

## Instrucciones para ejecutar el proyecto

1. Clonar el repositorio
```
git clone https://github.com/miguelSS05/MexUp
```
2. Instalar las dependencias
```
npm install
```
3. Colocar el .env
```
HOSTNAME=XXXXX
PORT=XXXXX
```
4. Correr el proyecto
```
npm run dev
```

## Tecnologias
- Node.js
- TypeScript


## Semanas

### Semana 1
Etiqueta: v1.0.0-http-core
- Servidor HTTP Nativo
- Demostracion de hilo bloqueante / no bloqueante
- Carga de variables de entorno
- .gitignore y README.md

### Semana 2
Etiqueta: v1.1.0-native-routing
- Middleware de login utilizando el header islogged
- Uso de try/catch en los controladores
- Respuesta del servidor empleando códigos HTTP y el header application/json
- Uso de los métodos GET, POST, PUT y DELETE para interactuar con los clientes enviando el ID en el query (json)
- Recibir datos usando req.on('data') y req.on('end')

Endpoints disponibles:

```
GET /clientes
GET /bloqueante
GET /no-bloqueante
POST /clientes
PUT /clientes
DELETE /clientes
```

Ejemplo de uso

```
curl -X POST http://127.0.0.1:3000/clientes -H "Content-Type: application/json" \
-H "islogged: 1" \
-d '{"id": 2, "nombre": "daniel", "apellido": "leyva", "edad": 21}'
```
