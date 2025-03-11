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
            { ethereumAddress: '0x01ceC1af057A7C30f33c697fA7C1dC0634aEF2dC', role },
        ];
        
        for (const user of users) {
            try {
                await ctx.stub.putState(
                    user.ethereumAddress, 
                    Buffer.from(JSON.stringify(user))
                );
            } catch (error) {
                console.error(`Failed to initialize user ${user.ethereumAddress}`);
                throw new Error('Failed to initialize user: ${user.ethereumAddress}');
            }
        }
        return 'Ledger initialized successfully';
    }
}

export const contracts: typeof Contract[] = [Chaincode, TestContract, AdminContract]; 