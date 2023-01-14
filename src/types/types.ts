import { Request } from 'express';

export interface RequestCustom extends Request {
  user?: {
    _id: string
  }
}
