export interface AuthResponse {
    ok: boolean,
    rol?: number,
    email_user?: string,
    distid?: string,
    token?: string,
    msg?: string
}

export interface Usuario{
    distid: string
    email_user: string
    rol: number
}