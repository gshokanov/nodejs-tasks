import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT as string,
    databaseUri: process.env.DATABASE_URI as string
};
