import { Producto } from "./producto";

export interface VentasWebs {
    ok:     boolean;
    ventas: Venta[];
}

export interface Venta {
    id:                    number;
    cantidad_vendida:      number;
    nombre_cliente:        string;
    fecha_venta:           Date;
    producto:              Producto;
    usuarios_mercadolibre: UsuariosMercadolibre;
}

export interface UsuariosMercadolibre {
    id:          number;
    correo:      string;
    estado:      boolean;
    id_empleado: number;
}
