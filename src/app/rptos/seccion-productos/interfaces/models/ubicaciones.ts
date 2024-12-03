import { Almacenistum } from "./almacenista";
import { FotoUbicacion } from "./foto_ubicacion";

export interface Ubicacion {
    id:           number;
    productoid:   number;
    distid:       string;
    ubicacion:    string;
    cantidad:           number | null;
    fecha_modificacion: Date | null;
    almacenistum: Almacenistum | null;
    foto_ubicacions:    FotoUbicacion[];
}
