import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestCustom extends Request {
  user?: {
    _id: string | JwtPayload
  }
}
