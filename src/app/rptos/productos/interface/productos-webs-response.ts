export interface ProductosMercadolibreResponse {
    ok:          boolean;
    productosml: Productosml[];
}

export interface Productosml {
    id:           number;
    id_producto:  number;
    precio1:      string;
    precio2:      string;
    precio1_porc: string;
    precio2_porc: string;
    producto:     Producto;
}

export interface Producto {
    nombre: string;
    codigo: string;
    marca:  Marca;
}

export interface Marca {
    id:     number;
    nombre: string;
}
