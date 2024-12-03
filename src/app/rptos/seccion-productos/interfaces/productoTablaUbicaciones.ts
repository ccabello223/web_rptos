import { FotoUbicacion } from "./models/foto_ubicacion";

export interface ProductoTablaUbicaciones {
    id:           number;
    ubicacion:    string;
    cantidad:           number | null;
    fecha_modificacion: Date | string;
    almacenista: string;
    foto_ubicacions:    FotoUbicacion[];
  }