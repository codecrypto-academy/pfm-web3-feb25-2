import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

@Info({ title: 'TestContract', description: 'Contract to verify connectivity' })
export class TestContract extends Contract {
    
    @Transaction()
    @Returns('string')
    public async test(ctx: Context): Promise<string> {
        return 'Test contract is working!';
    }
} 