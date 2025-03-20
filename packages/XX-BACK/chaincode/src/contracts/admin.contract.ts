import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ethers } from 'ethers';

@Info({ title: 'AdminContract', description: 'Allows admin manage users with eth addresses as unique identifiers and roles' })
export class AdminContract extends Contract {

    // Key to save users in the world state
    private getUserKey(user:string, key:string): string {
        return `${user}:${key}`;
    }
    
    @Transaction()
    @Returns('string')
    public async createUser(ctx: Context, ethereumAddress:string, role:string, signature:string, message:string): Promise<string> {         

        // gets admin key from the world state
        const adminKey = '0x7a6934Cc0Ddffe00cDD8E0F92E72cbffd13879EB';
        const adminBuffer = await ctx.stub.getState(adminKey);
        if (!adminBuffer || adminBuffer.length === 0) {
            throw new Error('Admin does not exist');
        }
        const admin = JSON.parse(adminBuffer.toString());
        
        // verify signature matches to an admin
        const signerAddress = ethers.verifyMessage(message, signature);
        if (admin.ethereumAddress.toLowerCase() !== signerAddress.toLowerCase()) {
            throw new Error(`Only admin can create users` );
        }

        // verify if user already exists
        const exists = await this.userExists(ctx, ethereumAddress);
        if (!exists) {
            const userBuffer = await ctx.stub.getState(ethereumAddress);
            let address = null;
            if (userBuffer && userBuffer.length > 0) {
                address = JSON.parse(userBuffer.toString()).ethereumAddress;
    
            }
            throw new Error(`User already exists ${address}`);
        }

        // create user
        const userKey = this.getUserKey(role, ethereumAddress);
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
        
        const iterator = await ctx.stub.getStateByRange('', '');
        
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