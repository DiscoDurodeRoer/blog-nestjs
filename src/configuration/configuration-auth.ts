import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
    secretKey: process.env.SECRETKEY_AUTH,
    authExpiresIn: process.env.AUTH_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '1d'
}))