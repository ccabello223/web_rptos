import { FotoProducto } from "./models/foto_producto";

export interface ProductoTabla {
    id: number;
    codigo: string;
    descripcion: string;
    marca: string | null;
    precio1: string;
    precio2: string;
    foto_producto?: FotoProducto[];
  }