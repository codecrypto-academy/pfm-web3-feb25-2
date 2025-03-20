import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ethers } from 'ethers';

@Info({ title: 'AdminContract', description: 'Allows admin manage users with eth addresses as unique identifiers and roles' })
export class AdminContract extends Contract {

    // Key to save users in the world state
    private getUserKey(key:string, user:string): string {
        return `user:${key}:${user}`;
    }
    
    @Transaction()
    @Returns('string')
    public async createUser(ctx: Context, ethereumAddress:string, role:string, signature:string, messageHash:string): Promise<string> {         

        // verify that signer is an admin
        const signer = ethers.verifyMessage(messageHash, signature);
        const signerKey = this.getUserKey('admin', signer)
        const adminBuffer = await ctx.stub.getState(signerKey);
        if (!adminBuffer || adminBuffer.length === 0) {
            throw new Error('Signer of the message is not an admin');
        }

        // verify if user already exists
        const userKey = this.getUserKey(role, ethereumAddress)
        const exists = await this.userExists(ctx, userKey);
        if (!exists) {
            const userBuffer = await ctx.stub.getState(userKey);
            let address = null;
            if (userBuffer && userBuffer.length > 0) {
                address = JSON.parse(userBuffer.toString()).ethereumAddress;
    
            }
            throw new Error(`User already exists ${address}`);
        }

        // create user
        const user = { ethereumAddress, role };
        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        return 'User created successfully';
    }

    @Transaction(false)
    @Returns('boolean')
    public async userExists(ctx: Context, ethereumAddress: string): Promise<boolean> {
        // const key = this.getUserKey(ethereumAddress, 'manufacturer');
        const userBuffer = await ctx.stub.getState(ethereumAddress);
        return userBuffer && userBuffer.length > 0;
    }

    @Transaction(false)
    @Returns('any[]')
    public async getAllEntries(ctx: Context): Promise<any[]> {
        
        const iterator = await ctx.stub.getStateByRange('user:a', 'user:z');
        
        const entries = [];
        
        let result = await iterator.next();
        while (!result.done) {
            const entryBuffer = result.value.value;
            if (entryBuffer && entryBuffer.length > 0) {
                const entry = JSON.parse(entryBuffer.toString());
                entries.push(entry);
            }
            result = await iterator.next();
        }

        await iterator.close();
        return entries;
    }
} 