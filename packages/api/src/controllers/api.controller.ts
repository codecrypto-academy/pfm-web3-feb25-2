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
      const { ethereumAddress } = req.body
      const contract = await getContract('Chaincode');
      const result = await contract.submitTransaction('init', ethereumAddress);
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

    // Crear un usuario (Manufacturer)
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { user, signature, messageHash } = req.body;
      const { ethereumAddress, role } = user

      const contract = await getContract('AdminContract');
      const result = await contract.submitTransaction('createUser', ethereumAddress, role, signature, messageHash);
      
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

  // get User by ethereumAddress
  static async getUserAddress(req: Request, res: Response): Promise<void> {
    const addressFilter = req.params
    try {
      const contract = await getContract('AdminContract');
      const result = await contract.evaluateTransaction('getAllUsers');
      const entries = JSON.parse(Buffer.from(result).toString());
      const usersByAddress = entries.filter((entry:any) => entry.ethereumAddress === addressFilter);

      if (usersByAddress.length === 0) {
        res.status(200).json({
          status: 'success',
          message: 'No user found',
          data: []
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: 'User retrieved successfully',
          data: usersByAddress
        });
      }
    } catch (error) {
      console.error(`Failed to get manufacturers: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // get User by role
  static async getUserByRole(req: Request, res: Response): Promise<void> {
    const { roleFilter } = req.params
    try {
      const contract = await getContract('AdminContract');
      const result = await contract.evaluateTransaction('getAllUsers');
      const entries = JSON.parse(Buffer.from(result).toString());
      const usersByRole = entries.filter((entry:any) => entry.role === roleFilter);

      if (usersByRole.length === 0) {
        res.status(200).json({
          status: 'success',
          message: `No ${roleFilter}s found`,
          data: []
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: `${roleFilter} retrieved successfully`,
          data: usersByRole
        });
      }
    } catch (error) {
      console.error(`Failed to get manufacturers: ${error}`);
      res.status(500).json({
        status: `${error}`,
        message: 'Internal server error'
      });
    }
  }

  // manufacturer endpoints

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