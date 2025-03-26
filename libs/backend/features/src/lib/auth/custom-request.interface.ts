import { Request } from 'express';

export interface CustomRequest extends Request {
  gebruikerId?: string; // Voeg de gebruikerId toe als optionele eigenschap
}
