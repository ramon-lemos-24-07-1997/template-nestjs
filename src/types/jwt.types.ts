
export interface JwtPayload {
    sub: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
}