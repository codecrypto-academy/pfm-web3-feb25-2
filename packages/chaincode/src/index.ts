import { Contract, Context, Transaction, Info  } from 'fabric-contract-api';
import { TestContract } from './contracts/test.contract';
import { AdminContract } from './contracts/admin.contract';

// Define a chaincode class
@Info({ title: 'Chaincode', description: 'Class that allows the inicialization of the ledger' }) 
class Chaincode extends Contract {
    
    @Transaction(false)
    public async Init(ctx: Context): Promise<void> {
        console.log('Initializing Ledger with admin users');
        
        const role  = { type: "admin" };
        const users  = [
            { ethereumAddress: '0xc57267649E6A3EBC0159b33FE5ba9c64DCdb9447', role },
        ];
        
        for (const user of users) {
            try {
                await ctx.stub.putState(
                    `admin:${user.ethereumAddress}`, 
                    Buffer.from(JSON.stringify(user))
                );
            } catch (error) {
                console.error(`Failed to initialize user ${user.ethereumAddress}`);
                throw new Error('Failed to initialize user: ${user.ethereumAddress}');
            }
        }
        console.log('Ledger initialized');
    }
}

export const contracts: typeof Contract[] = [Chaincode, TestContract, AdminContract]; 