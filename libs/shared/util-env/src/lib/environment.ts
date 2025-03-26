import { randomBytes } from "crypto";
import { IEnvironment } from "./environment.interface";

export const environment: IEnvironment = {
    production: false,
    jwtSecret: process.env.JWT_SECRET || randomBytes(32).toString('hex')
};
