import { Contract, Context, Transaction, Info, Returns  } from 'fabric-contract-api';
import { TestContract } from './contracts/test.contract';
import { AdminContract } from './contracts/admin.contract';
import { ManufacturerContract } from './contracts/manufacturer.contract';
import { User, UserSchema, Role, RoleSchema } from './models/model'

// Define a chaincode class
@Info({ title: 'Chaincode', description: 'Class that allows the inicialization of the ledger' }) 
class Chaincode extends Contract {
    
    @Transaction()
    @Returns('string')
    public async init(ctx: Context, ethereumAddress: string): Promise<string> {
        console.log('Initializing Ledger with admin users');
        
        const role  = "admin";
        const user  = { ethereumAddress, role };
        
        try {
            const userKey = this.getUserKey(role, ethereumAddress)
            await ctx.stub.putState(
                userKey, 
                Buffer.from(JSON.stringify(user))
            );
        } catch (error) {
            console.error(`Failed to initialize user ${user.ethereumAddress}`);
            throw new Error('Failed to initialize user: ${user.ethereumAddress}');
        }

        return 'Ledger initialized successfully';
    }

    private getUserKey(roleType:string, ethereumAddress:string): string {
        return `user:${roleType}:${ethereumAddress}`;
    }
}

export const contracts: typeof Contract[] = [Chaincode, TestContract, AdminContract, ManufacturerContract];