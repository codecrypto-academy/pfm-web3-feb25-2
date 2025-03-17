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
      const ethereumAddress = user.ethereumAddress.toLowerCase();
      const roleType = user.role;
      
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
  static async getAllUsers(req:Request, res:Response): Promise<void> {
    try {
      const contract = await getContract('AdminContract');
      const result = await contract.evaluateTransaction('getAllUsers');
      const entries = JSON.parse(Buffer.from(result).toString());
      
      res.status(200).json({
        result: entries,
        status: 'success',
        message: 'All users retrieved successfully'
      });
    } catch (error) {
      console.error(`Failed to get all entries: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // manufacturere endpoints

  // create phone asset
  static async createPhoneAsset(req:Request, res:Response){
    try {
      const { phone, signature, messageHash } = req.body;
      const phoneData = JSON.stringify(phone).toString()
      
      const contract = await getContract('ManufacturerContract');
      const result = await contract.submitTransaction('createPhoneAsset', signature, messageHash, phoneData);

      res.status(200).json({
        result: Buffer.from(result).toString('utf-8'),
        status: 'success',
        message: 'Phone Asset created successfully'
      });
    } catch (error) {
      console.error(`Failed to create user: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // transfer phone
  static async transferPhone(req:Request, res:Response): Promise<void> {
    try {
      const { phoneImei, newOwner, messageHash, signature } = req.body
      
      const contract = await getContract("ManufacturerContract");
      const result = await contract.submitTransaction("transferPhone", signature, messageHash, phoneImei, newOwner);

      res.status(200).json({
        result: Buffer.from(result).toString('utf-8'),
        status: 'success',
        message: 'Phone transfered susccessfully'
      })
    } catch (error) {
      console.error(`Failed to create user: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // get all registered phones
  static async getAllPhones(req:Request, res:Response): Promise<void> {
    try {
      const contract = await getContract('ManufacturerContract');
      const result = await contract.evaluateTransaction('getAllPhones');
      const entries = JSON.parse(Buffer.from(result).toString());
      
      res.status(200).json({
        result: entries,
        status: 'success',
        message: 'All phones retrieved successfully'
      });
    } catch (error) {
      console.error(`Failed to get all phones: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  static async getPhone(req:Request, res:Response) : Promise<void>{
    try {
      const phoneImei = req.params.phoneImei;
      const contract = await getContract('ManufacturerContract');
      const result = await contract.evaluateTransaction('getPhone', phoneImei);
      const phone = JSON.parse(Buffer.from(result).toString())

      res.status(200).json({
        result: phone,
        status: 'success',
        message:`Phone ${phoneImei} retrieve successfuly`
      });      
    } catch (error) {
      console.error(`Failed to get phone: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }
}