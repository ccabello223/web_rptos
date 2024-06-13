import { FotoProducto } from "./models/foto_producto";
import { Producto } from "./models/producto";

export interface ProductosMercadolibreResponse {
    ok:          boolean;
    productosml: Productosml[];
}

// export interface Productosml {
//     id:           number;
//     id_producto:  number;
//     precio1:      string;
//     precio2:      string;
//     precio1_porc: string;
//     precio2_porc: string;
//     precio3_porc: string;
//     producto:     Producto;
// }

export interface Productosml {
    id:             number;
    id_producto:    number;
    precio1:        string;
    precio2:        string;
    precio1_porc:   string;
    precio2_porc:   string;
    precio3_porc:   string;
    producto:       Producto;
    foto_productos: FotoProducto[];
}
