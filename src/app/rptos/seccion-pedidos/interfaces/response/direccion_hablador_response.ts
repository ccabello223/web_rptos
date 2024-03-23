import { Hablador } from "../models/hablador_pedido_info";

export interface DireccionHabladorResponse {
    ok:                boolean;
    direccionHablador: DireccionHablador[];
}

export interface DireccionHablador {
    id:                   number;
    id_hablador_pedido:   number;
    direccion:            string;
    estado:               number;
    hablador_pedido_info: Hablador;
}
