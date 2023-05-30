export interface Producto {
    producto: ProductoElement[];
}

export interface ProductoElement {
    idproducto:  number;
    codigo:      string;
    distid:      string;
    nombre:      string;
    datecreated: Date;
    categoriaid: number;
    categorium:  Categorium;
}

export interface Categorium {
    idcategoria: number;
    nombre:      string;
}


export interface UsuariosMercadoLibre {
    ok:       boolean;
    usuarios: Usuario[];
}

export interface Usuario {
    id:       number;
    correo:   string;
    estado:   boolean;
    empleado: Empleado;
}

export interface Empleado {
    nombre: string;
}



export interface ProductoMercadoLibre {
    ok:        boolean;
    productos: Producto[];
}

export interface Producto {
    id:           number;
    codigo:       string;
    nombre:       string;
    precio1:      string;
    precio2:      string;
    precio1_porc: string;
    precio2_porc: string;
    marca:        Marca;
}

export interface Marca {
    id:     number;
    nombre: string;
}

