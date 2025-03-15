import { Contract, Context, Transaction, Info, Returns  } from 'fabric-contract-api';
import { TestContract } from './contracts/test.contract';
import { AdminContract } from './contracts/admin.contract';

// Define a chaincode class
@Info({ title: 'Chaincode', description: 'Class that allows the inicialization of the ledger' }) 
class Chaincode extends Contract {
    
    @Transaction()
    @Returns('string')
    public async init(ctx: Context): Promise<string> {
        console.log('Initializing Ledger with admin users');
        
        const role  = { type: "admin" };
        const users  = [
            { ethereumAddress:'0x01cec1af057a7c30f33c697fa7c1dc0634aef2dc', role },
        ];
        
        for (const user of users) {
            const userKey = this.getUserKey(user.role.type, user.ethereumAddress);
            try {
                await ctx.stub.putState(
                    userKey, 
                    Buffer.from(JSON.stringify(user))
                );
            } catch (error) {
                console.error(`Failed to initialize user ${user.ethereumAddress}`);
                throw new Error(`Failed to initialize user: ${user.ethereumAddress}`);
            }
        }
        return 'Ledger initialized successfully';
    }

    private getUserKey(roleType:string, ethereumAddress:string): string {
        return `user:${roleType}:${ethereumAddress}`;
    }
}

export const contracts: typeof Contract[] = [Chaincode, TestContract, AdminContract];