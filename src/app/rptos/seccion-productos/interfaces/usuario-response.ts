export interface Usuario {
    id:       number;
    correo:   string;
    estado:   boolean;
    empleado: Empleado;
}

export interface Empleado {
    idempleado:  number;
    distid:      string;
    cedula:      string;
    nombre:      string;
    direccion:   null | string;
    telefono:    null | string;
    correo:      null | string;
    comision:    null | string;
    datecreated: Date | null;
}