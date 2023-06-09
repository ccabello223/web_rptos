export interface Productos {
    productos: Producto[];
}

export interface Producto {
    idproducto: number;
    codigo:     string;
    nombre:     string;
    distid:     string;
    precio1:    string;
    precio2:    string;
    marca:      Marca;
}

export interface Marca {
    id:     number;
    nombre: string;
}
