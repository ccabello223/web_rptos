import { Marca } from "./marca";


export interface Producto {
    idproducto: number;
    codigo:     string;
    nombre:     string;
    distid:     string;
    precio1:    string;
    precio2:    string;
    marca:      Marca;
}