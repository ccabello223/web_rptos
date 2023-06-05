export interface NotaReponse {
    ok:       boolean;
    detalles: Detalles;
}

export interface Detalles {
    peso:           string;
    alto:           string;
    ancho:          string;
    largo:          string;
    precioEstimado: string;
    nota:           string;
}