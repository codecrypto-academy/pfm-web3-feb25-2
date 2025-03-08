import { type Contract } from 'fabric-contract-api';
import { TestContract } from './contracts/testContract';

//export { TestContract } from './contracts/testContract';

export const contracts: typeof Contract[] = [TestContract]; 