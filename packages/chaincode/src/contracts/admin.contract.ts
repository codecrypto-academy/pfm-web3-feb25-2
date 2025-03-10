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
    public async createUser(ctx: Context, user:string, role:string, signature:string, message:string): Promise<string> {         

        // gets admin key from the world state
        const adminKey = 'admin:0xc57267649E6A3EBC0159b33FE5ba9c64DCdb9447';
        const adminBuffer = await ctx.stub.getState(adminKey);
        if (!adminBuffer || adminBuffer.length === 0) {
            throw new Error('Admin does not exist');
        }
        const admin = JSON.parse(adminBuffer.toString());
        
        // // verify signature matches to an admin
        // const signerAddress = ethers.verifyMessage(message, signature);
        // if (admin.ethereumAddress.toLowerCase() !== signerAddress) {
        //     throw new Error('Only admin can create users');
        // }

        // verify if user already exists
        const exists = await this.userExists(ctx, user);
        if (exists) {
            throw new Error('User already exists');
        }

        // create user
        const userKey = this.getUserKey(role, user);
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
} 