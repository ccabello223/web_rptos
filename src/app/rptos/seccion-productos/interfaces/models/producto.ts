import { Marca } from "../marca";
import { FotoProducto } from "./foto_producto";

export interface Producto {
    idproducto:    number;
    codigo:        string;
    nombre:        string;
    distid:        string;
    precio1:       string;
    precio2:       string;
    marca:         Marca | null;
    foto_productos: FotoProducto[];
}