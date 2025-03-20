import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ethers } from 'ethers';
import { User, UserSchema } from '../models/model'

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
        const signerAddress = ethers.verifyMessage(messageHash, signature);
        const adminKey = this.getUserKey('admin', signerAddress);
        const adminExists = await this.userExists(ctx, adminKey);
        if (!adminExists) {
            throw new Error(`Admin does not exist`);
        }

        // verify if user already exists
        const userKey = this.getUserKey(role, ethereumAddress);
        const userExists = await this.userExists(ctx, userKey);
        if (userExists) {
            throw new Error(`User already exists`);
        }

        // create user
        const user = { ethereumAddress, role };
        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        return `User created successfully`;
    }

    @Transaction(false)
    @Returns('boolean')
    public async userExists(ctx: Context, userKey: string): Promise<boolean> {
        const userBuffer = await ctx.stub.getState(userKey);
        return userBuffer && userBuffer.length > 0;
    }

    @Transaction(false)
    @Returns('User[]')
    public async getAllUsers(ctx: Context): Promise<User[]> {
        const iterator = await ctx.stub.getStateByRange('user: ', 'user:z');
        
        const entries:User[] = [];
        
        let result = await iterator.next();
        while (!result.done) {
            const entryBuffer = result.value.value;
            if (entryBuffer && entryBuffer.length > 0) {
                const entry:User = JSON.parse(entryBuffer.toString());
                entries.push(entry);
            }
            result = await iterator.next();
        }

        await iterator.close();
        return entries;
    }
} 