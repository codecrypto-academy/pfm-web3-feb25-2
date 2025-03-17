import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ethers } from 'ethers';
import { Phone, PhoneSchema } from '../models/model'

@Info({ title: 'ManufacturerContract', description: 'Allows Manufacturer to create and send tokens' })
export class ManufacturerContract extends Contract {
    
    // Key to save assets in the world state
    private getKey(type:string, uid:string): string {
        return `${type}:${uid}`;
    }
    
    @Transaction()
    @Returns('string')
    public async createPhoneAsset(
        ctx: Context, 
        signature:string, 
        messageHash:string, 
        phoneData:string): Promise<string> {

        // verify that the signature and messageHash correspond to the manufacturer
        const signerAddress = ethers.verifyMessage(messageHash, signature).toLowerCase();
        const signerKey = this.getKey('user:manufacturer', signerAddress);
        const signerExists = await this.assetExists(ctx, signerKey);
        if (!signerExists) {
            throw new Error(`User ${signerKey} can't create phone assets`);
        }

        // verify that the phone data is correct
        const phone = JSON.parse(phoneData);
        const phoneValidation = PhoneSchema.parse(phone)
        
        // verify that the phone is not already registered
        const phoneKey = this.getKey('phone', phoneValidation.imei);
        const phoneExists = await this.assetExists(ctx, phoneKey);
        if (phoneExists){
            throw new Error('Phone already registered')
        }

        // create phone asset
        await ctx.stub.putState(phoneKey, Buffer.from(JSON.stringify(phoneValidation)))

        // return phone token id 
        return `${phone.imei} phone's token created successfully`;
    }

    @Transaction()
    @Returns('string')
    public async transferPhoneAsset(
        ctx: Context, 
        signature: string, 
        messageHash: string, 
        phoneImei: string, 
        newOwner: string) : Promise<string> {
            
        // verify signer
        const signerAddress = ethers.verifyMessage(messageHash, signature).toLowerCase();
        const signerKey = this.getKey('manufacturer', signerAddress);
        const signerExists = await this.assetExists(ctx, signerKey);
        if (!signerExists) {
            throw new Error(`User can't transfer the phone`);
        }
            
        // verify phone
        const phoneKey = this.getKey('phone', phoneImei);
        const phoneExists = await this.assetExists(ctx, phoneKey);
        if (phoneExists){
            throw new Error("Phone is already registered")
        }
        
        // verify signer is the owner of the phone
        const phoneBuffer = await ctx.stub.getState(phoneKey);
        const phone: Phone = JSON.parse(phoneBuffer.toString());
        if (signerAddress === phone.owner){
            throw new Error("The signer is not the owner of the phone")
        }
        
        // verify newOWner exists
        const newOwnerKey = this.getKey('user:retailer',newOwner)
        const newOwnerExists = this.assetExists(ctx, newOwnerKey)
        if (!newOwnerExists) {
            throw new Error("Can't transfer phone to a user that doesn't exist")
        }
        // transfer asset to new owner
        phone.owner = newOwner
        await ctx.stub.putState(phoneKey, Buffer.from(JSON.stringify(phone)))
        return `Phone asset has been transfered from ${signerAddress} to ${phone.owner}` 

    }

    @Transaction(false)
    @Returns('boolean')
    private async assetExists(ctx: Context, key: string): Promise<boolean> {
        const userBuffer = await ctx.stub.getState(key);
        return userBuffer && userBuffer.length > 0;
    }
}