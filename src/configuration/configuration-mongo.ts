import { registerAs } from "@nestjs/config";


export default registerAs('mongo', () => ({
    host: process.env.HOST_MONGODB || 'localhost',
    port: process.env.PORT_MONGODB,
    database: process.env.DATABASE_MONGODB
}))