export interface cliente {
	id: number,
	nombre: string,
	apellido: string,
	edad: number
}

export interface IResponse { 
	msg: String
}

interface producto {
	id: number,
	nombre: string,
	precio: number
}

export const clientes: cliente[] = [
	{
		id: 1,
		nombre: "miguel",
		apellido: "soto",
		edad: 21
	}
]

export const productos: producto[] = [
	{
		id: 1,
		nombre: "camisa1",
		precio: 100
	},
	{
		id: 2,
		nombre: "camisa2",
		precio: 110
	} 
]
