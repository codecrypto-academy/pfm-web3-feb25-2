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
            { ethereumAddress: '0x7a6934Cc0Ddffe00cDD8E0F92E72cbffd13879EB', role },
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