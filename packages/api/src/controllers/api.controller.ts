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

  // init endpoint
  static async initLedger(req:Request, res:Response): Promise<void> {
    try {
      const contract = await getContract('Chaincode');
      const result = await contract.submitTransaction('init');
      res.status(200).json({
        result: Buffer.from(result).toString('utf-8'),
        status: 'success',
        message: 'Ledger initialized successfully'
      });
    } catch (error) {
      console.error(`Failed to initialize ledger: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // admin endpoints

  // create user
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

  // get all registered users
  static async getAllEntries(req:Request, res:Response): Promise<void> {
    try {
      const contract = await getContract('AdminContract');
      const result = await contract.evaluateTransaction('getAllEntries');
      const entries = JSON.parse(Buffer.from(result).toString());
      
      res.status(200).json({
        result: entries,
        status: 'success',
        message: 'All entries retrieved successfully'
      });
    } catch (error) {
      console.error(`Failed to get all entries: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }
}