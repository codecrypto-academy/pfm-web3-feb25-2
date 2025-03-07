import { Request, Response } from 'express';

export class ApiController {

  // test endpoint
  static async test(req:Request, res:Response): Promise<void> {
    try {
      res.status(200).json({ 
        status: 'success',
        message: 'Hello from the api!' 
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}