import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT as string,
    databaseUri: process.env.DATABASE_URI as string,
    logLevel: process.env.LOG_LEVEL as string,
    secret: process.env.SECRET as string,
    origin: process.env.ORIGIN as string
};
