export interface HabladorInfo {
    ok:         boolean;
    habladores: Hablador[];
}

export interface Hablador {
    id:      number;
    cliente: string;
    riff:    string;
    estado:  number;
}