export interface AuthResponse {
    ok: boolean,
    rol?: number,
    email_user?: string,
    distid?: string,
    usuario?: number,
    token?: string,
    msg?: string
}

export interface Usuario{
    distid: string
    usuario: number,
    email_user: string
    rol: number
}