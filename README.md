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
- Autocannon


## Última semana

### Semana 3 
Etiqueta: v1.2.0-streams-buffers-cluster
- Prueba de carga utilizando la dependencia autocannon, disponible en el endpoint /autocannon especificando una prueba con el header "test"
- Uso del módulo cluster para crear una instancia en cada núcleo
- Procesamiento de archivos mediante readable, writeable, transform y pipeline
- Manejo de backpressure empleando la función .write() del flujo de escritura

Endpoints disponibles:

```
GET /clientes
GET /bloqueante
GET /no-bloqueante
GET /autocannon
GET /stream/1
GET /stream/2
POST /clientes
PUT /clientes
DELETE /clientes
```
