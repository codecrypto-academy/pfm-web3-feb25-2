import { Contract, Context, Transaction, Info, Returns  } from 'fabric-contract-api';
import { TestContract } from './contracts/test.contract';
import { AdminContract } from './contracts/admin.contract';

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
            await ctx.stub.putState(
                `user:${role}:${ethereumAddress}`, 
                Buffer.from(JSON.stringify(user))
            );
        } catch (error) {
            console.error(`Failed to initialize user ${user.ethereumAddress}`);
            throw new Error('Failed to initialize user: ${user.ethereumAddress}');
        }

        return 'Ledger initialized successfully';
    }
}

export const contracts: typeof Contract[] = [Chaincode, TestContract, AdminContract]; 