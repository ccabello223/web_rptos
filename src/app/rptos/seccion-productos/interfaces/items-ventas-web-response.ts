import { Producto } from "./models/producto";

export interface ItemsVentasWebResponse {
    ok:          boolean;
    itemsVentas: ItemsVenta[];
}

export interface ItemsVenta {
    id:               number;
    cantidad_vendida: number;
    estado:           boolean;
    producto:         Producto;
}
