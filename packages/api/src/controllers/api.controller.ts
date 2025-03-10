import { Request, Response } from 'express';
import { getContract } from '../services/fabricService';

export class ApiController {

  // test endpoint
  static async test(req:Request, res:Response): Promise<void> {
    try {
      const contract = await getContract('TestContract');
      const result = await contract.submitTransaction('test');
      res.status(200).json({
        result: Buffer.from(result).toString('utf-8'),
        status: 'success',
        message: 'Test contract is working!'
      });
    } catch (error) {
      console.error(`Failed to test contract: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // admin endpoints
  static async createUser(req:Request, res:Response): Promise<void> {
    try {
      const { user, signature, message } = req.body;
      const ethereumAddress = user.ethereumAddress;
      const roleType = user.role.type;
      
      const contract = await getContract('AdminContract');
      const result = await contract.submitTransaction('createUser', ethereumAddress, roleType, signature, message);
      
      res.status(200).json({
        result: Buffer.from(result).toString('utf-8'),
        status: 'success',
        message: 'User created successfully'
      });
    } catch (error) {
      console.error(`Failed to create user: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }
}