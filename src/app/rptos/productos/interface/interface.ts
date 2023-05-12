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
