export interface NotaReponse {
    ok:       boolean;
    detalles: Detalles;
}

export interface Detalles {
    id_producto_ml: number;
    peso:           string;
    alto:           string;
    ancho:          string;
    largo:          string;
    precioEstimado: string;
    nota:           string;
    id_usuario_ml:  number;
}
